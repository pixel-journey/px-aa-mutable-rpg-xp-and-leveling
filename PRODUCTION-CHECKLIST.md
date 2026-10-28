# Production checklist

Before this pattern can be considered complete, the following must exist and must match the tested rule.

## Must be present

- [ ] Asset-row read from the `atomicassets` assets table. (Structure shown in the sketch; real table not present.)
- [ ] Schema read so the format for deserialization is known. (Structure shown; real schema table not present.)
- [ ] `atomicdata::deserialize` of the mutable bytes. (Structure shown; headers not vendored.)
- [ ] Confirmation that the caller is on the collection's authorized-editor list. (Structure shown; real list not read.)
- [ ] Level-consistency check against the stored xp. (Present in the sketch.)
- [ ] Full-map write via `setassetdata` (no partial map). (Structure shown; call not compiled.)
- [ ] Deterministic CDT build that produces a wasm whose behavior matches `npm test`. (Not run.)

## Already covered by the tested rule

- [x] Editor authorization (educational stand-in).
- [x] Previous must come from the chain (educational stand-in).
- [x] Gain 1–10000 (negative, zero, and non-integer refused).
- [x] Durability must not go below 0; always subtracts 1.
- [x] Level must already match the formula.
- [x] XP must stay inside uint32.
- [x] Partial map is demonstrated as a wipe.
- [x] New key is refused.

The C++ sketch now shows the structure of the remaining production steps. It has not been compiled. The real AtomicAssets headers are not vendored. Do not deploy it until a deterministic build has been verified.

See PRODUCTION-SEQUENCE.md for the required order of operations.
