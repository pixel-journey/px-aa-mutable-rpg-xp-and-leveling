export const invariants = [
  {
    id: "partial-map-wipe",
    attack: "Build a new ATTRIBUTE_MAP with only xp and pass it to setassetdata.",
    expect: "Forbidden. Deserialize the stored blob, mutate, write the full map. A fixture with durability=40 must still report 40 after an XP write.",
  },
  {
    id: "wrong-variant",
    attack: "Schema says durability is uint16 and the editor does std::get<uint32_t>.",
    expect: "holds_alternative<uint16_t> is false, so the action throws before the write.",
  },
  {
    id: "durability-floor",
    attack: "durability_cost greater than current durability.",
    expect: "throws repair required. No write.",
  },
  {
    id: "bounds",
    attack: "xp_gained = 100001 or durability_cost = 101.",
    expect: "throws. The caps are in questcomplete.",
  },
  {
    id: "unauthorized-editor",
    attack: "Contract account is not on the collection authorized_accounts list.",
    expect: "atomicassets rejects setassetdata. The reference file does not call it yet, so this vector is mandatory before mainnet.",
  },
];
