export const SinQuality {
  LEVEL_1: 1,
  LEVEL_2: 2,
  LEVEL_3: 3,
  LEVEL_4: 4,
  LEVEL_5: 5,
  LEVEL_6: 6,
}

export const SinQualityFlairMap: Record<SinQuality, string> = {
  [SinQuality.LEVEL_1]: "1 - Barely Exists",
  [SinQuality.LEVEL_2]: "2 - Questionable",
  [SinQuality.LEVEL_3]: "3 - Standard",
  [SinQuality.LEVEL_4]: "4 - Solid",
  [SinQuality.LEVEL_5]: "5 - High-Grade",
  [SinQuality.LEVEL_6]: "6 - Unquestionable",
};

export function getSinQualityFlair(quality: SinQuality): string {
  return SinQualityFlairMap[quality] || "Unknown Quality";
}

export function getAllSinQualities(): { value: SinQuality; text: string }[] {
  return Array.from(SinQualityFlairMap.entries()).map(([value, text]) => ({
    value,
    text,
  }));
}
