import {
  BloodType,
  Gender,
  SinQuality,
  type ProfileData,
} from "../proto/profile.pb";
import { ShadowrunNationality } from "../components/shadowrun-flags";

export const INITIAL_SIN_ID_MODULE = "00000000-0000-0000-0000-000000000000";

export const getDefaultProfileData = (): ProfileData => ({
  sinId: INITIAL_SIN_ID_MODULE,
  active: false,
  sinQuality: SinQuality.SIN_QUALITY_LEVEL_3,
  licenses: {},
  level1: {
    photo: "/blank-profile-picture.svg",
  },
  level2: {
    name: "Jane Doe",
    birthdate: "N/A",
    birthplace: "N/A",
    gender: Gender.GENDER_UNSPECIFIED,
    metatype: "N/A",
  },
  level3: {
    fullName: "Jane Doe",
    address: "N/A",
    city: "N/A",
    country: "N/A",
    nationality: ShadowrunNationality.UNKNOWN,
    occupation: "N/A",
    datalinks: [],
  },
  level4: {
    fingerprintHash: "N/A",
    retinalHash: "N/A",
    voiceHash: "N/A",
    height: 0,
    weight: 0,
    eyeColor: "N/A",
    hairColor: "N/A",
    skinTone: "N/A",
  },
  level5: {
    employer: "N/A",
    employerAddress: "N/A",
    travelStamps: [],
    affiliationCodes: [],
    educationRecords: [],
    residenceHistory: [],
  },
  level6: {
    bloodType: BloodType.BLOOD_TYPE_UNSPECIFIED,
    dnaSequenceHash: "N/A",
    geneticMarkers: [],
    medicalAlertCodes: "N/A",
  },
  baseSeed: 0,
  biometricSeed: 0,
  backgroundSeed: 0,
});

export const GenderDisplayMap: Record<Gender, string> = {
  [Gender.GENDER_UNSPECIFIED]: "Unspecified",
  [Gender.GENDER_MALE]: "Male",
  [Gender.GENDER_FEMALE]: "Female",
  [Gender.GENDER_DIVERSE]: "Diverse",
};

export const BloodTypeDisplayMap: Record<BloodType, string> = {
  [BloodType.BLOOD_TYPE_UNSPECIFIED]: "Unspecified",
  [BloodType.BLOOD_TYPE_A_POSITIVE]: "A+",
  [BloodType.BLOOD_TYPE_A_NEGATIVE]: "A-",
  [BloodType.BLOOD_TYPE_B_POSITIVE]: "B+",
  [BloodType.BLOOD_TYPE_B_NEGATIVE]: "B-",
  [BloodType.BLOOD_TYPE_AB_POSITIVE]: "AB+",
  [BloodType.BLOOD_TYPE_AB_NEGATIVE]: "AB-",
  [BloodType.BLOOD_TYPE_O_POSITIVE]: "O+",
  [BloodType.BLOOD_TYPE_O_NEGATIVE]: "O-",
};
