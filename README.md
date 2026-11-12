# px-aa-mutable-rpg-xp-and-leveling

> **Stack:** layer 5 of 5 — [MUTABLE-STACK.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/MUTABLE-STACK.md)  
> **Sources:** [SOURCES.md](SOURCES.md)

The **mutate** step before `atomicassets::setassetdata`. Private. Not deployed. The chain was not written.

The tested rule is `invariants/mutable-xp.ts`. The unsigned action body is `client/setassetdata-action.ts`. It calls that same rule. It does not read the chain and it does not broadcast.

Ground truth for the action: [contract source](https://github.com/pinknetworkx/atomicassets-contract) and [WAX mutable-data tutorial](https://docs.wax.io/build/tutorials/howto_atomicassets/mutabledata). `setassetdata` stores a **full** serialized map. A partial map is a wipe of every omitted key.

## What is true

`npm test` runs both files. 19 tests passed on 2026-10-28.

- Authorized editor: xp 50, level 1, durability 10, nickname oak, gain 50 → xp 100, level 2, durability 9, nickname oak.
- That result is the `setassetdata` attribute array, sorted by key, with uint32 and string types. There is no signature on the object.
- Unauthorized caller is refused before an action is built.
- Previous map that is not marked as coming from the chain is refused. The client will not stamp `source: "chain"` for you.
- Level must already be `1 + floor(xp / 100)`. A mismatch is refused.
- Durability 0 is refused. One gain subtracts 1. There is no caller-supplied durability cost.
- Gain is an integer from 1 to 10000. Negative or non-integer gain is refused. xp must stay inside uint32.
- A string stored where `xp`, `level`, or `durability` must be a uint32 is refused before arithmetic.
- A map that contains only the changed keys does not contain `nickname`. That is the wipe.
- A type map or a stored map that drops `nickname` is refused.
- A new key is refused. Asset id `0` is refused.

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
- `COLLECTION-AUTH.md` — collection editor requirement (see also live `check_has_collection_auth` in the contract).
- `SECONDARY-PERMISSION.md` — why `require_auth(asset_owner)` is not sufficient.
- `DESERIALIZER.md` — why the mutable bytes must be deserialized before mutation.
- `PRODUCTION-SEQUENCE.md` — required order of operations.
- `PRODUCTION-CHECKLIST.md` — what must still be present before deployment.
- `PLACEHOLDERS.md` — why the sketch uses placeholder types.
- `SOURCES.md` — official contract and docs.wax.io links.

## Earlier layers

| Layer | Repo |
| --- | --- |
| 1 | [px-aa-mutable-deserialize-core](https://github.com/pixel-journey/px-aa-mutable-deserialize-core) |
| 2 | [px-aa-mutable-safe-partial-updater](https://github.com/pixel-journey/px-aa-mutable-safe-partial-updater) |
| 3 | [px-aa-mutable-all-primitive-types](https://github.com/pixel-journey/px-aa-mutable-all-primitive-types) |
| 4 | [px-aa-mutable-vector-arrays-crud](https://github.com/pixel-journey/px-aa-mutable-vector-arrays-crud) |

## Uncompiled sketch

`contracts/src/px_mutable_engine.cpp` is uncompiled. The numeric checks use uint32, matching the tested rule, and there is no durability-cost argument. The asset-row read, the deserializer, the collection-editor list, and the `setassetdata` send are still comments. Placeholder zeros are not a chain read. The real AtomicAssets headers are not vendored. A deterministic CDT build has not been run. The test is the rule. Do not treat the file as the integration.
