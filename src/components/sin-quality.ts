// Represents the actual numeric values for SIN Quality levels
export type SinQualityValue = 1 | 2 | 3 | 4 | 5 | 6;

// Object providing named access to the SIN Quality levels
export const SinQuality = {
  LEVEL_1: 1 as SinQualityValue,
  LEVEL_2: 2 as SinQualityValue,
  LEVEL_3: 3 as SinQualityValue,
  LEVEL_4: 4 as SinQualityValue,
  LEVEL_5: 5 as SinQualityValue,
  LEVEL_6: 6 as SinQualityValue,
};

export const SinQualityFlairMap = {
  [SinQuality.LEVEL_1]: "1 - Barely Exists",
  [SinQuality.LEVEL_2]: "2 - Questionable",
  [SinQuality.LEVEL_3]: "3 - Standard",
  [SinQuality.LEVEL_4]: "4 - Solid",
  [SinQuality.LEVEL_5]: "5 - High-Grade",
  [SinQuality.LEVEL_6]: "6 - Unquestionable",
} as Record<SinQualityValue, string>;

export function getSinQualityFlair(quality: SinQualityValue): string {
  return SinQualityFlairMap[quality] || "Unknown Quality";
}

export function getAllSinQualities(): { value: SinQualityValue; text: string }[] {
  return Object.entries(SinQualityFlairMap).map(([valueStr, text]) => ({
    value: Number(valueStr) as SinQualityValue,
    text,
  }));
}
