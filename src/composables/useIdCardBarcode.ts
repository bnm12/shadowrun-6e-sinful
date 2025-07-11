import { computed, type ComputedRef } from "vue";
import Rand from "rand-seed";
import type { ProfileData } from "../proto/profile.pb";

export function useIdCardBarcode(
  internalProfileData: ComputedRef<ProfileData>
) {
  const barcodeWidths = computed(() => {
    const barcodeRand = new Rand(internalProfileData.value.sinId);
    const max = 9;
    const min = 0;
    return Array.from({ length: 75 }, () =>
      Math.floor(barcodeRand.next() * (max - min + 1) + min)
    );
  });

  return {
    barcodeWidths,
  };
}
