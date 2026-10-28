# px-aa-mutable-rpg-xp-and-leveling

The mutate step before `atomicassets::setassetdata`. Private. Not deployed. The chain was not written.

The tested rule is `invariants/mutable-xp.ts`.

## What is true

`npm test` runs the rule.

- Authorized editor: xp 50, level 1, durability 10, nickname oak, gain 50 → xp 100, level 2, durability 9, nickname oak.
- Unauthorized caller is refused.
- Previous map that is not marked as coming from the chain is refused.
- Level must already be `1 + floor(xp / 100)`. A mismatch is refused.
- Durability 0 is refused. One gain subtracts 1.
- Gain is an integer from 1 to 10000. Negative or non-integer gain is refused. xp must stay inside uint32.
- A string stored where `xp`, `level`, or `durability` must be a uint32 is refused before arithmetic.
- A map that contains only the changed keys does not contain `nickname`. That is the wipe.
- A new key is refused.

On a contract the previous map must come from the asset row, not from the caller. That read and the AtomicAssets deserializer are not in this repository. The `source: "chain"` marker is an educational stand-in for the read. `requireUint32` is the stand-in for `holds_alternative` before `std::get`.

## Run

```bash
npm test
```

No host is called.

## Educational notes

- `EDUCATION.md` — overview.
- `SECURITY.md` — authorization and bounds.
- `WIPE-BUG.md` — why a partial map erases sibling keys.
- `LEVEL-CONSISTENCY.md` — why the stored level must already match the formula.
- `TYPE-CHECK.md` — why a string must not be read as a uint32.
- `COLLECTION-AUTH.md` — collection editor requirement.
- `SECONDARY-PERMISSION.md` — why `require_auth(asset_owner)` is not sufficient.
- `DESERIALIZER.md` — why the mutable bytes must be deserialized before mutation.
- `PRODUCTION-SEQUENCE.md` — required order of operations.
- `PRODUCTION-CHECKLIST.md` — what must still be present before deployment.
- `PLACEHOLDERS.md` — why the sketch uses placeholder types.

## Uncompiled sketch

`contracts/src/px_mutable_engine.cpp` is uncompiled. It now shows the structure of the asset-row read, the schema read, the deserialize step, the collection-editor check, the level-consistency check, and the full-map `setassetdata` call. The real AtomicAssets headers are not vendored. A deterministic CDT build has not been run. The test is the rule. Do not treat the file as the integration.
