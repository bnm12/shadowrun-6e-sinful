import type { ShadowrunNationalityType } from "../components/shadowrun-flags";
import type { ShadowrunMetatypeType } from "../components/shadowrun-metatypes";
import type { SinQualityValue } from "../components/sin-quality";

// Based on SinQuality.LEVEL_1 in IdCard.vue
export interface ProfileBasic {
  name?: string;
  gender?: "Male" | "Female" | "Diverse" | "N/A";
  nationality?: ShadowrunNationalityType;
  metatype?: ShadowrunMetatypeType | "N/A";
  photo?: string;
  // sinId is global to ProfileData
  // sinQuality is global to ProfileData
}

// Based on SinQuality.LEVEL_2 in IdCard.vue
export interface ProfileIdentity {
  address?: string;
  city?: string;
  country?: string;
  birthdate?: string;
  birthplace?: string;
}

// Based on SinQuality.LEVEL_3 in IdCard.vue
export interface ProfilePhysical {
  size?: string;
  height?: string;
  weight?: string;
  skin?: string;
  hair?: string;
  eyes?: string;
  bloodType?: string;
  fingerprints?: string;
}

// Based on SinQuality.LEVEL_4 in IdCard.vue
export interface ProfileMedical {
  eyeScan?: string;
  medicalRecord?: string;
}

// Based on SinQuality.LEVEL_5 in IdCard.vue
export interface ProfileEmployment {
  profession?: string;
  employer?: string;
  employerAddress?: string;
  verifiedDataLinks?: {
    civil?: string;
    bank?: string;
    personal?: string;
  };
}

// Based on SinQuality.LEVEL_6 in IdCard.vue
export interface ProfileGenetic {
  dnaFingerprintPattern?: string;
}

export interface ProfileData {
  // Top-level identifiers and metadata
  sinId?: string; // SIN (System Identification Number) or internal ID
  systemId?: string; // System status/ID for display
  idc?: string; // Identification Code for display
  additionalCode?: string; // Additional codes/text for display
  sinQuality: SinQualityValue; // Overall quality of the SIN
  licenses?: Record<string, SinQualityValue>; // Licenses associated with the SIN

  // Nested data structures for tabbed information
  Basic: ProfileBasic;
  Identity: ProfileIdentity;
  Physical: ProfilePhysical;
  Medical: ProfileMedical;
  Employment: ProfileEmployment;
  Genetic: ProfileGenetic;
}
