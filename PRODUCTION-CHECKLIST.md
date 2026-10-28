# Production checklist

Before this pattern can be considered complete, the following must exist and must match the tested rule.

## Must be present

- [ ] Asset-row read from the `atomicassets` assets table.
- [ ] Schema read so the format for deserialization is known.
- [ ] `atomicdata::deserialize` of the mutable bytes.
- [ ] Confirmation that the caller is on the collection's authorized-editor list (or holds the correct secondary permission).
- [ ] Level-consistency check against the stored xp.
- [ ] Full-map write via `setassetdata` (no partial map).
- [ ] Deterministic CDT build that produces a wasm whose behavior matches `npm test`.

## Already covered by the tested rule

- [x] Editor authorization (educational stand-in).
- [x] Previous must come from the chain (educational stand-in).
- [x] Gain 1–10000.
- [x] Durability must not go below 0; always subtracts 1.
- [x] Level must already match the formula.
- [x] XP must stay inside uint32.
- [x] Partial map is demonstrated as a wipe.
- [x] New key is refused.

The C++ sketch is uncompiled. Do not deploy it until the items above are present and a build has been verified.
