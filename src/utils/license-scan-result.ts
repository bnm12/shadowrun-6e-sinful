import type { sincheckresult } from "./sin-check-helpers";

export const licenseScanResultTextMap: Record<
  sincheckresult,
  { title: string; message: string }
> = {
  success: {
    title: "Verification successful",
    message: "License is valid.",
  },
  blip: {
    title: "Verification blip",
    message: "License may be forged or duplicated.",
  },
  flagged: {
    title: "Verification annomoly",
    message: "License is likely forged or has alerts.",
  },
  burned: {
    title: "Verification failed",
    message: "License is invalid and has been blacklisted.",
  },
};
