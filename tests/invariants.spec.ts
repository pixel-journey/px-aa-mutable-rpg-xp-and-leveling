/** Attack notes that match invariants/mutable-xp.ts. Not a second implementation. */
export const invariants = [
  {
    id: "partial-map-wipe",
    attack: "Build a new map with only xp, level, and durability, and pass it to setassetdata.",
    expect: "The nickname is gone. mergeMutable keeps every existing key. toAttributeMap refuses a type map that omits one.",
  },
  {
    id: "wrong-variant",
    attack: "xp is stored as a string, or a numeric field is missing.",
    expect: "requireUint32 throws before any addition. Do not coerce the string.",
  },
  {
    id: "durability-floor",
    attack: "Stored durability is 0, or a negative number.",
    expect: "Throws. No write. The rule always subtracts 1 and does not take a caller-supplied cost.",
  },
  {
    id: "bounds",
    attack: "Gain is 0, negative, not an integer, above 10000, or would push xp past uint32.",
    expect: "Throws. The caps are in applyGain.",
  },
  {
    id: "unauthorized-editor",
    attack: "The caller is not the authorized editor, or previous was supplied by the caller instead of the asset row.",
    expect: "Throws before an action body is built. atomicassets would also reject an editor who is not on the collection list. That list is not read here.",
  },
  {
    id: "level-mismatch",
    attack: "Stored level is not 1 + floor(xp / 100).",
    expect: "Throws. The contract must not overwrite a corrupt pair as if it were consistent.",
  },
];
