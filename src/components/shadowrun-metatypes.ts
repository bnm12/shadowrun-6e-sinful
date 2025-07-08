// Shadowrun 6E Metatype Constants
export const ShadowrunMetatype = {
  HUMAN: "Human",
  ELF: "Elf",
  DWARF: "Dwarf",
  ORK: "Ork",
  TROLL: "Troll",
} as const;

// Type for metatype values
export type ShadowrunMetatypeType =
  (typeof ShadowrunMetatype)[keyof typeof ShadowrunMetatype];

// Helper function to get all available metatypes
export function getAllMetatypes(): ShadowrunMetatypeType[] {
  return Object.values(ShadowrunMetatype);
}
