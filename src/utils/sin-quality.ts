import { SinQuality } from "../proto/profile.pb";

export const SinQualityFlairMap = {
  [SinQuality.SIN_QUALITY_LEVEL_1]: "1 - Barely Exists",
  [SinQuality.SIN_QUALITY_LEVEL_2]: "2 - Questionable",
  [SinQuality.SIN_QUALITY_LEVEL_3]: "3 - Standard",
  [SinQuality.SIN_QUALITY_LEVEL_4]: "4 - Solid",
  [SinQuality.SIN_QUALITY_LEVEL_5]: "5 - High-Grade",
  [SinQuality.SIN_QUALITY_LEVEL_6]: "6 - Unquestionable",
} as Record<SinQuality, string>;

// Titles for each SIN Quality level
export const SinQualityTitleMap = {
  [SinQuality.SIN_QUALITY_LEVEL_1]: "Basic",
  [SinQuality.SIN_QUALITY_LEVEL_2]: "Identity",
  [SinQuality.SIN_QUALITY_LEVEL_3]: "Physical",
  [SinQuality.SIN_QUALITY_LEVEL_4]: "Medical",
  [SinQuality.SIN_QUALITY_LEVEL_5]: "Employment",
  [SinQuality.SIN_QUALITY_LEVEL_6]: "Genetic",
} as Record<SinQuality, string>;
