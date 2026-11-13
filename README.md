# RPG mutables: XP, level, durability without wiping the map

> **Stack:** layer 5 of 5 — [MUTABLE-STACK.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/MUTABLE-STACK.md)  
> **Sources:** [SOURCES.md](SOURCES.md)

**Goal:** The **mutate** step before `atomicassets::setassetdata` for an RPG-style asset: authorized gain updates XP and level together, decrements durability, and keeps every sibling key (including nickname).

**Code under test:** `invariants/mutable-xp.ts` plus `client/setassetdata-action.ts` (unsigned action body). `npm test` runs unit, composition, and client tests. This repository does not read live tables or broadcast.

**Ground truth:** [atomicassets-contract](https://github.com/pinknetworkx/atomicassets-contract), [WAX mutable-data tutorial](https://docs.wax.io/build/tutorials/howto_atomicassets/mutabledata). `setassetdata` stores a **full** serialized map — a partial map wipes every omitted key.

## Composition

`mutable-xp.composition.test.ts` walks a multi-gain lifecycle: nickname survives sequential gains, level tracks XP, durability drains to **broken**, partial wipe drops nickname while merge does not, and a failed unauthorized attempt leaves the prior map valid for retry.

## What is true (executed)

- Authorized editor: xp 50, level 1, durability 10, nickname oak, gain 50 → xp 100, level 2, durability 9, nickname oak.
- Unauthorized caller is refused before an action is built.
- Previous map must be marked chain-sourced (`source: "chain"` stand-in for the asset-row read).
- Level must already equal `1 + floor(xp / 100)`.
- Durability 0 is refused; each gain subtracts 1.
- Gain is an integer from 1 to 10000; xp stays inside uint32.
- A map that contains only the changed keys does not contain `nickname` — that is the wipe.

On a production contract the previous map must come from the asset row. The deserializer and collection-editor list are documented in the companion notes below; they are not simulated as live RPC here.

## Run

```bash
npm test
```

## Companion notes

| Doc | Topic |
| --- | --- |
| `EDUCATION.md` | Overview |
| `SECURITY.md` | Authorization and bounds |
| `WIPE-BUG.md` | Why partial maps erase siblings |
| `LEVEL-CONSISTENCY.md` | Why stored level must match the formula |
| `TYPE-CHECK.md` | Why a string is not a uint32 |
| `COLLECTION-AUTH.md` | Collection editor requirement |
| `SECONDARY-PERMISSION.md` | Why owner auth alone is insufficient |
| `DESERIALIZER.md` | Why bytes must be deserialized before mutation |
| `PRODUCTION-SEQUENCE.md` / `PRODUCTION-CHECKLIST.md` | Deployment order |
| `SOURCES.md` | Official links |

## Earlier layers

| Layer | Repo |
| --- | --- |
| 1 | [px-aa-mutable-deserialize-core](https://github.com/pixel-journey/px-aa-mutable-deserialize-core) |
| 2 | [px-aa-mutable-safe-partial-updater](https://github.com/pixel-journey/px-aa-mutable-safe-partial-updater) |
| 3 | [px-aa-mutable-all-primitive-types](https://github.com/pixel-journey/px-aa-mutable-all-primitive-types) |
| 4 | [px-aa-mutable-vector-arrays-crud](https://github.com/pixel-journey/px-aa-mutable-vector-arrays-crud) |

## C++ sketch scope

`contracts/src/px_mutable_engine.cpp` mirrors the numeric checks in uint32 form. Asset-row read, deserializer, collection-editor list, and `setassetdata` send remain documented stubs until AtomicAssets headers are vendored and compiled through [wax-contract-compiler](https://github.com/pixel-journey/wax-contract-compiler). The TypeScript tests are the executable rule of this repository.

MIT — Pixel Journey
