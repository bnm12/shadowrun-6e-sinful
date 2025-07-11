import { computed, type ComputedRef } from "vue";
import Rand from "rand-seed";
import type { ProfileData } from "../@types/profile";
import { ShadowrunNationality } from "../components/shadowrun-flags";

export function useIdCardSystemInfo(internalProfileData: ComputedRef<ProfileData>) {
  const idc = computed(() => {
    const myRand = new Rand(internalProfileData.value.sinId);
    return `R-${myRand.next().toString().slice(-9)} - ${myRand
      .next()
      .toString()
      .slice(2, 11)} - ${myRand.next().toString().slice(2, 11)} - 01`;
  });

  const additionalCode = computed(() => {
    return `<<< ${
      internalProfileData.value.Basic?.nationality || ShadowrunNationality.UNKNOWN
    }/${
      internalProfileData.value.Basic?.metatype || "UNKNOWN"
    } >>> SIN ID VERIFIED`;
  });

  return {
    idc,
    additionalCode,
  };
}
