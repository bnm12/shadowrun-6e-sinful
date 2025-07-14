import type { sincheckresult } from "./sin-check-helpers";

export const licenseScanResultTextMap: Record<sincheckresult, string> = {
  success: "Verification successful. License is valid.",
  blip: "Verification blip. License may be forged or duplicated.",
  flagged: "Verification annomoly. License is likely forged or has alerts.",
  burned: "Verification failed. License is invalid and has been blacklisted.",
};
