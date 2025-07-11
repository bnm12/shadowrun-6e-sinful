// Shadowrun 6E Nationality Constants
export const ShadowrunNationality = {
  // North America
  UCAS: "UCAS",
  CAS: "CAS",
  QUEBEC: "Quebec",
  CALIFORNIA_FREE_STATE: "California Free State",
  TIR_TAIRNGIRE: "Tír Tairngire",
  TIR_NA_NOG: "Tír na nÓg",
  AZTLAN: "Aztlan",
  SALISH_SHIDHE: "Salish-Shidhe",
  SIOUX_NATION: "Sioux Nation",
  PUEBLO_CORPORATE_COUNCIL: "Pueblo Corporate Council",
  ALGONKIAN_MANITOU: "Algonkian-Manitou",

  // Europe
  GERMAN_ALLIANCE: "German Alliance",
  ALLIED_GERMAN_STATES: "Allied German States",
  FRANCE: "France",
  UNITED_KINGDOM: "United Kingdom",
  SCANDINAVIAN_UNION: "Scandinavian Union",
  POLAND: "Poland",
  CZECH_REPUBLIC: "Czech Republic",
  ITALY: "Italy",
  SPAIN: "Spain",
  NETHERLANDS: "Netherlands",
  SWITZERLAND: "Switzerland",
  AUSTRIA: "Austria",

  // Asia
  JAPANESE_IMPERIAL_STATE: "Japanese Imperial State",
  CHINA: "China",
  KOREA: "Korea",
  HONG_KONG: "Hong Kong",
  PHILIPPINES: "Philippines",
  THAILAND: "Thailand",
  INDONESIA: "Indonesia",
  MALAYSIA: "Malaysia",
  SINGAPORE: "Singapore",
  INDIA: "India",
  TIBET: "Tibet",

  // Middle East & Africa
  TURKEY: "Turkey",
  ISRAEL: "Israel",
  EGYPT: "Egypt",
  MOROCCO: "Morocco",
  ALGERIA: "Algeria",
  SOUTH_AFRICA: "South Africa",
  NIGERIA: "Nigeria",
  KENYA: "Kenya",
  GHANA: "Ghana",
  AZANIA: "Azania",

  // South America
  BRAZIL: "Brazil",
  ARGENTINA: "Argentina",
  CHILE: "Chile",
  COLOMBIA: "Colombia",
  VENEZUELA: "Venezuela",
  PERU: "Peru",
  ECUADOR: "Ecuador",
  BOLIVIA: "Bolivia",

  // Oceania
  AUSTRALIA: "Australia",
  NEW_ZEALAND: "New Zealand",
  HAWAII: "Hawai'i",

  // Corporate Nations
  RENRAKU_ARCOLOGY: "Renraku Arcology",
  FUCHI_CORPORATE: "Fuchi Corporate",
  AZTECHNOLOGY: "Aztechnology",
  SAEDER_KRUPP: "Saeder-Krupp",
  ARES_MACROTECHNOLOGY: "Ares Macrotechnology",

  // Metahuman Nations
  SEELIE_COURT: "Seelie Court",
  UNSEELIE_COURT: "Unseelie Court",
  ORK_UNDERGROUND: "Ork Underground",
  TROLL_KINGDOM: "Troll Kingdom",

  // Awakened Nations
  AMAZONIA: "Amazonia",
  YAKUT: "Yakut",
  TRANS_POLAR_ALEUT: "Trans-Polar Aleut",

  // Default fallback
  UNKNOWN: "Unknown",
} as const;

// Type for nationality values
export type ShadowrunNationalityType =
  (typeof ShadowrunNationality)[keyof typeof ShadowrunNationality];

// Shadowrun 6E Flag Definitions
export const SHADOWRUN_FLAGS: Record<string, string> = {
  // North America
  UCAS: "linear-gradient(to bottom, #ff0000 33%, #ffffff 33%, #ffffff 66%, #0000ff 66%)",
  CAS: "linear-gradient(to bottom, #ff0000 20%, #ffffff 20%, #ffffff 40%, #ff0000 40%, #ffffff 60%, #ff0000 60%, #ffffff 80%, #ff0000 80%)",
  Quebec:
    "linear-gradient(to right, #0000ff 33%, #ffffff 33%, #ffffff 66%, #0000ff 66%)",
  "California Free State":
    "linear-gradient(to bottom, #ff0000 50%, #ffff00 50%)",
  "Tír Tairngire":
    "linear-gradient(135deg, #006400 0%, #228b22 50%, #32cd32 100%)",
  "Tír na nÓg":
    "linear-gradient(to right, #006400 33%, #ffffff 33%, #ffffff 66%, #ff8c00 66%)",
  Aztlan:
    "linear-gradient(to bottom, #006400 33%, #ffffff 33%, #ffffff 66%, #ff0000 66%)",
  "Salish-Shidhe":
    "linear-gradient(45deg, #8b4513 0%, #daa520 50%, #228b22 100%)",
  "Sioux Nation": "linear-gradient(to right, #ff0000 50%, #ffff00 50%)",
  "Pueblo Corporate Council":
    "linear-gradient(to bottom, #ff8c00 50%, #4169e1 50%)",
  "Algonkian-Manitou":
    "linear-gradient(135deg, #8b4513 0%, #ffffff 50%, #0000ff 100%)",

  // Europe
  "German Alliance":
    "linear-gradient(to bottom, #000000 33%, #ff0000 33%, #ff0000 66%, #ffff00 66%)",
  "Allied German States":
    "linear-gradient(to bottom, #000000 33%, #ff0000 33%, #ff0000 66%, #ffff00 66%)",
  France:
    "linear-gradient(to right, #0000ff 33%, #ffffff 33%, #ffffff 66%, #ff0000 66%)",
  "United Kingdom":
    "linear-gradient(45deg, #012169 0%, #ffffff 25%, #ce1126 50%, #ffffff 75%, #012169 100%)",
  "Scandinavian Union":
    "linear-gradient(to right, #ff0000 40%, #ffff00 40%, #ffff00 60%, #0000ff 60%)",
  Poland: "linear-gradient(to bottom, #ffffff 50%, #ff0000 50%)",
  "Czech Republic": "linear-gradient(to bottom, #ffffff 50%, #ff0000 50%)",
  Italy:
    "linear-gradient(to right, #006400 33%, #ffffff 33%, #ffffff 66%, #ff0000 66%)",
  Spain:
    "linear-gradient(to bottom, #ff0000 25%, #ffff00 25%, #ffff00 75%, #ff0000 75%)",
  Netherlands:
    "linear-gradient(to bottom, #ff0000 33%, #ffffff 33%, #ffffff 66%, #0000ff 66%)",
  Switzerland: "linear-gradient(to bottom, #ff0000 0%, #ffffff 100%)",
  Austria:
    "linear-gradient(to bottom, #ff0000 33%, #ffffff 33%, #ffffff 66%, #ff0000 66%)",

  // Asia
  "Japanese Imperial State":
    "linear-gradient(to bottom, #ffffff 0%, #ff0000 100%)",
  China: "linear-gradient(to bottom, #ff0000 0%, #ffff00 100%)",
  Korea:
    "linear-gradient(to bottom, #ffffff 25%, #ff0000 25%, #ff0000 50%, #0000ff 50%, #0000ff 75%, #ffffff 75%)",
  "Hong Kong": "linear-gradient(to bottom, #ff0000 0%, #ffffff 100%)",
  Philippines: "linear-gradient(to bottom, #0000ff 50%, #ff0000 50%)",
  Thailand:
    "linear-gradient(to bottom, #ff0000 20%, #ffffff 20%, #ffffff 40%, #0000ff 40%, #0000ff 60%, #ffffff 60%, #ffffff 80%, #ff0000 80%)",
  Indonesia: "linear-gradient(to bottom, #ff0000 50%, #ffffff 50%)",
  Malaysia:
    "linear-gradient(to bottom, #ff0000 25%, #ffffff 25%, #ffffff 50%, #ff0000 50%, #ffffff 75%, #ff0000 75%)",
  Singapore: "linear-gradient(to bottom, #ff0000 50%, #ffffff 50%)",
  India:
    "linear-gradient(to bottom, #ff8c00 33%, #ffffff 33%, #ffffff 66%, #006400 66%)",
  Tibet:
    "linear-gradient(to bottom, #ffff00 25%, #ff0000 25%, #ff0000 50%, #0000ff 50%, #0000ff 75%, #ffff00 75%)",

  // Middle East & Africa
  Turkey: "linear-gradient(to bottom, #ff0000 0%, #ffffff 100%)",
  Israel:
    "linear-gradient(to bottom, #0000ff 25%, #ffffff 25%, #ffffff 75%, #0000ff 75%)",
  Egypt:
    "linear-gradient(to bottom, #ff0000 33%, #ffffff 33%, #ffffff 66%, #000000 66%)",
  Morocco: "linear-gradient(to bottom, #ff0000 0%, #006400 100%)",
  Algeria: "linear-gradient(to right, #006400 50%, #ffffff 50%)",
  "South Africa":
    "linear-gradient(135deg, #ff0000 0%, #ffff00 25%, #006400 50%, #0000ff 75%, #000000 100%)",
  Nigeria:
    "linear-gradient(to right, #006400 33%, #ffffff 33%, #ffffff 66%, #006400 66%)",
  Kenya:
    "linear-gradient(to bottom, #000000 33%, #ff0000 33%, #ff0000 66%, #006400 66%)",
  Ghana:
    "linear-gradient(to bottom, #ff0000 33%, #ffff00 33%, #ffff00 66%, #006400 66%)",
  Azania:
    "linear-gradient(to bottom, #000000 33%, #ff0000 33%, #ff0000 66%, #006400 66%)",

  // South America
  Brazil:
    "linear-gradient(to bottom, #006400 25%, #ffff00 25%, #ffff00 75%, #0000ff 75%)",
  Argentina:
    "linear-gradient(to bottom, #87ceeb 33%, #ffffff 33%, #ffffff 66%, #87ceeb 66%)",
  Chile:
    "linear-gradient(to bottom, #0000ff 33%, #ffffff 33%, #ffffff 66%, #ff0000 66%)",
  Colombia: "linear-gradient(to bottom, #ffff00 50%, #0000ff 25%, #ff0000 25%)",
  Venezuela:
    "linear-gradient(to bottom, #ffff00 33%, #0000ff 33%, #0000ff 66%, #ff0000 66%)",
  Peru: "linear-gradient(to right, #ff0000 33%, #ffffff 33%, #ffffff 66%, #ff0000 66%)",
  Ecuador:
    "linear-gradient(to bottom, #ffff00 33%, #0000ff 33%, #0000ff 66%, #ff0000 66%)",
  Bolivia:
    "linear-gradient(to bottom, #ff0000 33%, #ffff00 33%, #ffff00 66%, #006400 66%)",

  // Oceania
  Australia: "linear-gradient(to bottom, #0000ff 0%, #ffffff 100%)",
  "New Zealand": "linear-gradient(to bottom, #0000ff 0%, #ffffff 100%)",
  "Hawai'i":
    "linear-gradient(to bottom, #ffffff 12.5%, #ff0000 12.5%, #ff0000 25%, #0000ff 25%, #0000ff 37.5%, #ffffff 37.5%, #ffffff 50%, #ff0000 50%, #ff0000 62.5%, #0000ff 62.5%, #0000ff 75%, #ffffff 75%, #ffffff 87.5%, #ff0000 87.5%)",

  // Corporate Nations
  "Renraku Arcology": "linear-gradient(to bottom, #ff0000 0%, #000000 100%)",
  "Fuchi Corporate": "linear-gradient(to bottom, #0000ff 0%, #ffffff 100%)",
  Aztechnology: "linear-gradient(to bottom, #ff8c00 0%, #8b4513 100%)",
  "Saeder-Krupp": "linear-gradient(to bottom, #000000 0%, #ff0000 100%)",
  "Ares Macrotechnology":
    "linear-gradient(to bottom, #ff0000 0%, #ffffff 100%)",

  // Metahuman Nations
  "Seelie Court":
    "linear-gradient(135deg, #ffd700 0%, #ffffff 50%, #32cd32 100%)",
  "Unseelie Court":
    "linear-gradient(135deg, #4b0082 0%, #000000 50%, #8b0000 100%)",
  "Ork Underground": "linear-gradient(to bottom, #8b4513 0%, #000000 100%)",
  "Troll Kingdom": "linear-gradient(to bottom, #696969 0%, #000000 100%)",

  // Awakened Nations
  Amazonia: "linear-gradient(135deg, #228b22 0%, #32cd32 50%, #006400 100%)",
  Yakut: "linear-gradient(to bottom, #ffffff 0%, #87ceeb 100%)",
  "Trans-Polar Aleut": "linear-gradient(to bottom, #87ceeb 0%, #ffffff 100%)",

  // Default fallback
  Unknown: "linear-gradient(to right, #808080 0%, #a0a0a0 100%)",
};

// Helper function to get flag CSS for a nationality
export function getFlagCSS(nationality: string): string {
  return SHADOWRUN_FLAGS[nationality] || SHADOWRUN_FLAGS["Unknown"];
}

// Helper function to get all available nationalities
export function getAllNationalities(): string[] {
  return Object.values(ShadowrunNationality);
}
