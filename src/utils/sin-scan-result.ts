import type { sincheckresult } from "./sin-check-helpers";

export const sinScanResultTextMap: Record<
  sincheckresult,
  { title: string; message: string }
> = {
  success: {
    title: "Verification successful",
    message: "SIN is valid.",
  },
  blip: {
    title: "Verification blip",
    message: "SIN may be forged or duplicated.",
  },
  flagged: {
    title: "Verification annomoly",
    message: "SIN is likely forged or has alerts.",
  },
  burned: {
    title: "Verification failed",
    message: "SIN is invalid and has been blacklisted.",
  },
};
