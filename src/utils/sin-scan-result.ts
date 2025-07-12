import type { sincheckresult } from "./sin-check-helpers";

export const sinScanResultTextMap: Record<sincheckresult, string> = {
  success: "Verification successful. SIN is valid.",
  blip: "Verification blip. SIN may be forged or duplicated.",
  flagged: "Verification annomoly. SIN is likely forged or has alerts.",
  burned: "Verification failed. SIN is invalid and has been blacklisted.",
};
