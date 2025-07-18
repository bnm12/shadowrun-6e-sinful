import { ref, readonly } from "vue";
import { ProfileData } from "../proto/profile.pb";
import { gzipSync, gunzipSync } from "fflate";

// A singleton AbortController to manage NFC scanning sessions.
let abortController: AbortController | null = null;

// Define interfaces for callbacks to provide better type-checking and autocompletion.
interface NfcReadCallbacks {
  onScanStart?: () => void;
  onSuccess: (profileData: ProfileData) => void;
  onError: (errorMessage: string) => void;
  onFinished?: () => void; // Called after success or error, for cleanup.
}

interface NfcWriteCallbacks {
  onWriteStart?: () => void;
  onSuccess: (message: string) => void;
  onError: (errorMessage: string) => void;
  onFinished?: () => void; // Called after success or error, for cleanup.
}

export function useNfc() {
  const isReading = ref(false);
  const isWriting = ref(false);

  const readTag = async (
    callbacks: NfcReadCallbacks,
    continuous: boolean = false
  ) => {
    if (isReading.value && abortController) {
      abortController.abort(); // Abort existing scan if a new one is initiated.
    }

    if (!("NDEFReader" in window)) {
      callbacks.onError(
        "Web NFC is not available. Please use a compatible browser."
      );
      return;
    }

    abortController = new AbortController();
    isReading.value = true;
    callbacks.onScanStart?.();

    abortController.signal.onabort = () => {
      isReading.value = false;
      console.log("NFC scan aborted.");
      callbacks.onFinished?.();
    };

    try {
      // @ts-ignore
      const ndef = new NDEFReader();

      ndef.onreading = (event: any) => {
        let sinDataFound = false;
        for (const record of event.message.records) {
          if (
            record.recordType === "mime" &&
            record.mediaType === "application/vnd.shadowrun.sin+gzip"
          ) {
            try {
              if (!record.data) throw new Error("Record data is undefined.");
              const compressedData = new Uint8Array(record.data.buffer);
              const decompressedData = gunzipSync(compressedData);
              const parsedProfileData = ProfileData.decode(decompressedData);
              callbacks.onSuccess(parsedProfileData);
              sinDataFound = true;
              if (!continuous) {
                abortController?.abort();
              }
              break; // Exit after finding and processing the SIN data.
            } catch (e: any) {
              callbacks.onError(`Error processing SIN data: ${e.message}`);
              if (!continuous) abortController?.abort();
              break;
            }
          }
        }
        if (!sinDataFound) {
          callbacks.onError(
            "No Shadowrun SIN data found on this tag, or data is corrupted."
          );
        }
        if (!continuous) abortController?.abort(); // Ensure scan stops if no relevant data found.
      };

      ndef.onreadingerror = (event: any) => {
        callbacks.onError(
          `Error reading tag: ${event.message || "Unknown read error"}`
        );
        abortController?.abort();
      };

      await ndef.scan({ signal: abortController.signal });
    } catch (error: any) {
      if (error.name !== "AbortError") {
        callbacks.onError(
          `Error starting scan: ${
            error.message || "Failed to start NDEFReader"
          }`
        );
      }
      isReading.value = false;
      callbacks.onFinished?.();
      abortController = null;
    }
  };

  const writeTag = async (
    profileDataFromForm: ProfileData,
    callbacks: NfcWriteCallbacks
  ) => {
    if (!("NDEFReader" in window)) {
      callbacks.onError(
        "Web NFC is not available. Please use a compatible browser."
      );
      return;
    }

    isWriting.value = true;
    callbacks.onWriteStart?.();

    try {
      // @ts-ignore
      const ndef = new NDEFReader();
      const encodedData = ProfileData.encode(profileDataFromForm);
      const compressedData = gzipSync(encodedData, { level: 9 });
      const readPageUrl = new URL(window.location.href);
      readPageUrl.hash = "sin-check";

      await ndef.write({
        records: [
          { recordType: "url", data: readPageUrl.toString() },
          {
            recordType: "mime",
            mediaType: "application/vnd.shadowrun.sin+gzip",
            data: compressedData,
          },
        ],
      });
      callbacks.onSuccess(
        `Successfully wrote SIN for ${profileDataFromForm.level2?.name} to tag.`
      );
    } catch (error: any) {
      callbacks.onError(`Error writing SIN data: ${error.message || error}`);
    } finally {
      isWriting.value = false;
      callbacks.onFinished?.();
    }
  };

  const abortScan = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  return {
    isReading: readonly(isReading),
    isWriting: readonly(isWriting),
    readTag,
    writeTag,
    abortScan,
  };
}
