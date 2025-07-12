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
  basic: {
    name: "Jane Doe",
    gender: Gender.GENDER_UNSPECIFIED,
    nationality: ShadowrunNationality.UNKNOWN,
    metatype: "N/A",
    photo: "/blank-profile-picture.svg",
  },
  identity: {
    address: "N/A",
    city: "N/A",
    country: "N/A",
    birthdate: "N/A",
  },
  physical: {
    height: 0,
    weight: 0,
    skin: "N/A",
    hair: "N/A",
    eyes: "N/A",
    seed: 0,
  },
  medical: {
    bloodType: BloodType.BLOOD_TYPE_UNSPECIFIED,
    seed: 0,
  },
  employment: {
    profession: "N/A",
    employer: "N/A",
    employerAddress: "N/A",
    seed: 0,
  },
  genetic: {
    seed: 0,
  },
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
