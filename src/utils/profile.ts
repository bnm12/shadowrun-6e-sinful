import type { ProfileData } from "../@types/profile";
import { ShadowrunNationality } from "../components/shadowrun-flags";
import { SinQuality } from "../components/sin-quality";

export const INITIAL_SIN_ID_MODULE = "00000000-0000-0000-0000-000000000000";

export const getDefaultProfileData = (): ProfileData => ({
  sinId: INITIAL_SIN_ID_MODULE,
  active: false,
  sinQuality: SinQuality.LEVEL_1,
  licenses: {},
  Basic: {
    name: "Jane Doe",
    gender: "N/A",
    nationality: ShadowrunNationality.UNKNOWN,
    metatype: "N/A",
    photo: "/blank-profile-picture.svg",
  },
  Identity: {
    address: "N/A",
    city: "N/A",
    country: "N/A",
    birthdate: "N/A",
  },
  Physical: {
    size: "N/A",
    height: "N/A",
    weight: "N/A",
    skin: "N/A",
    hair: "N/A",
    eyes: "N/A",
    fingerprints: "N/A",
  },
  Medical: {
    bloodType: "N/A",
    eyeScan: "N/A",
    medicalRecord: "N/A",
  },
  Employment: {
    profession: "N/A",
    employer: "N/A",
    employerAddress: "N/A",
    verifiedDataLinks: { civil: "N/A", bank: "N/A", personal: "N/A" },
  },
  Genetic: {
    dnaFingerprintPattern: 0,
  },
});
