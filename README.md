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
- Gain is an integer from 1 to 10000. xp must stay inside uint32.
- A map that contains only the changed keys does not contain `nickname`. That is the wipe.
- A new key is refused.

On a contract the previous map must come from the asset row, not from the caller. That read and the AtomicAssets deserializer are not in this repository. The `source: "chain"` marker is an educational stand-in for the read.

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
- `COLLECTION-AUTH.md` — collection editor requirement.
- `SECONDARY-PERMISSION.md` — why `require_auth(asset_owner)` is not sufficient.

## Uncompiled sketch

`contracts/src/px_mutable_engine.cpp` is uncompiled. The gain cap and the fixed durability cost of 1 now match the tested rule. It still lacks the asset-row read, the deserializer, the collection-editor check, and the `setassetdata` call. The test is the rule. Do not treat the file as the integration.
