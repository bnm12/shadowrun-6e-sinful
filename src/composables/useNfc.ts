import { ref } from "vue";
import { ProfileData } from "../proto/profile.pb";
import { gzipSync, gunzipSync } from "fflate"; // Removed strToU8

export type ScanStatus = "idle" | "scanning" | "success" | "error";

// A singleton AbortController to manage NFC scanning sessions.
// This allows any component to stop the current NFC scan, which is crucial
// for a single-page application (SPA) where navigation shouldn't leave
// old scans running in the background.
let abortController: AbortController | null = null;

export function useNfc() {
  const isWriting = ref(false);
  const writeStatusMessage = ref("");
  const writeStatusMessageType = ref<"success" | "error" | "">("");

  const currentScanStatus = ref<ScanStatus>("idle");
  const currentScanResultMessage = ref("");
  const scannedProfileData = ref<ProfileData>({} as ProfileData);

  const readTag = async (continuous = false) => {
    // If a scan is already in progress, don't start a new one.
    if (currentScanStatus.value === "scanning" && abortController) {
      console.log("Scan already in progress.");
      return;
    }

    // Reset state for a new scan session
    currentScanStatus.value = "idle";
    currentScanResultMessage.value = "";
    scannedProfileData.value = {} as ProfileData;

    if (!("NDEFReader" in window)) {
      currentScanStatus.value = "error";
      currentScanResultMessage.value =
        "Web NFC is not available. Please use a compatible browser (e.g., Chrome on Android) and ensure it's enabled.";
      return;
    }

    try {
      // @ts-ignore
      const ndef = new NDEFReader();
      abortController = new AbortController();

      // Signal to abort previous scans.
      abortController.signal.onabort = () => {
        console.log("NFC scan aborted.");
        currentScanStatus.value = "idle";
        currentScanResultMessage.value = "Scan aborted.";
      };

      ndef.onreading = (event: any) => {
        let sinDataFound = false;
        currentScanResultMessage.value = "Tag detected! Processing...";

        for (const record of event.message.records) {
          if (
            record.recordType === "mime" &&
            record.mediaType === "application/vnd.shadowrun.sin+gzip"
          ) {
            try {
              if (!record.data) throw new Error("Record data is undefined.");
              const compressedData = new Uint8Array(record.data.buffer);
              const decompressedData = gunzipSync(compressedData);
              currentScanResultMessage.value =
                "Decompressed (auto-detect format) and processing SIN data...";

              const parsedProfileData = ProfileData.decode(decompressedData);
              sinDataFound = true;
              currentScanStatus.value = "success";
              currentScanResultMessage.value = "SIN data found and parsed.";
              scannedProfileData.value = parsedProfileData;
              if (!continuous) {
                abortController?.abort();
              }
              break;
            } catch (e: any) {
              currentScanStatus.value = "error";
              currentScanResultMessage.value = `Error processing SIN data: ${e.message}`;
              console.error("Error processing SIN data:", e);
              if (!continuous) {
                abortController?.abort();
              }
              break;
            }
          } else if (record.recordType === "mime") {
            console.log("Skipping record with mediaType:", record.mediaType);
          }
        }
        if (!sinDataFound && currentScanStatus.value !== "error") {
          currentScanStatus.value = "error";
          currentScanResultMessage.value =
            "No Shadowrun SIN data found on this tag, or data is corrupted/unreadable.";
        }
      };

      ndef.onreadingerror = (event: any) => {
        currentScanStatus.value = "error";
        currentScanResultMessage.value = `Error reading tag: ${
          event.message || "Unknown read error"
        }`;
        console.error("NDEFReader.onreadingerror", event);
      };

      await ndef.scan({ signal: abortController.signal });
      currentScanStatus.value = "scanning";
      currentScanResultMessage.value =
        "Bring a tag closer to read. Scanning...";
    } catch (error: any) {
      currentScanStatus.value = "error";
      if (error.name === "AbortError") {
        currentScanResultMessage.value = "Scan was aborted.";
      } else {
        currentScanResultMessage.value = `Error starting scan: ${
          error.message || "Failed to start NDEFReader"
        }`;
      }
      console.error("Error starting NDEFReader scan:", error);
      abortController = null; // Clear the controller on error
    }
  };

  const abortScan = () => {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
  };

  const writeTag = async (profileDataFromForm: ProfileData) => {
    isWriting.value = true;
    writeStatusMessage.value = "";
    writeStatusMessageType.value = "";

    if (!("NDEFReader" in window)) {
      writeStatusMessage.value =
        "Web NFC is not available. Please use a compatible browser (e.g., Chrome on Android) and ensure it's enabled.";
      writeStatusMessageType.value = "error";
      isWriting.value = false;
      return;
    }

    try {
      // @ts-ignore
      const ndef = new NDEFReader();
      const encodedData = ProfileData.encode(profileDataFromForm);
      const compressedData = gzipSync(encodedData, { level: 9 });

      const readPageUrl = new URL(window.location.href);
      readPageUrl.hash = "sin-check";
      await ndef.write({
        records: [
          {
            recordType: "url",
            data: readPageUrl.toString(),
          },
          {
            recordType: "mime",
            mediaType: "application/vnd.shadowrun.sin+gzip",
            data: compressedData,
          },
        ],
      });
      writeStatusMessage.value = `Successfully wrote compressed SIN data for ${profileDataFromForm.basic.name} to tag.`;
      writeStatusMessageType.value = "success";
    } catch (error: any) {
      console.error("Error writing compressed SIN data to tag:", error);
      writeStatusMessage.value = `Error writing SIN data: ${
        error.message || error
      }`;
      writeStatusMessageType.value = "error";
    } finally {
      isWriting.value = false;
      setTimeout(() => {
        writeStatusMessage.value = "";
        writeStatusMessageType.value = "";
      }, 5000);
    }
  };

  return {
    isWriting,
    writeStatusMessage,
    writeStatusMessageType,
    currentScanStatus,
    currentScanResultMessage,
    scannedProfileData,
    readTag,
    writeTag,
    abortScan,
  };
}
