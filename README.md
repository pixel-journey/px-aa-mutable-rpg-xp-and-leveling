# RPG mutables: XP, level, durability without wiping the map

> **Stack:** layer 5 of 5 — [MUTABLE-STACK.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/MUTABLE-STACK.md)  
> **Sources:** [SOURCES.md](SOURCES.md)

**Goal:** The **mutate** step before `atomicassets::setassetdata` for an RPG-style asset: authorized gain updates XP and level together, decrements durability, and keeps every sibling key (including nickname).

**Code under test:** `invariants/mutable-xp.ts` plus `client/setassetdata-action.ts` (unsigned). `npm test` runs unit, composition, and client tests. No live tables, no broadcast.

**Ground truth:** [atomicassets-contract](https://github.com/pinknetworkx/atomicassets-contract), [WAX mutable-data tutorial](https://docs.wax.io/build/tutorials/howto_atomicassets/mutabledata).

## Learning materials

| Doc | Topic |
| --- | --- |
| [EDUCATION.md](EDUCATION.md) | Overview course |
| [WORKED-EXAMPLES.md](WORKED-EXAMPLES.md) | Gain, wipe vs merge, refusals |
| [TIPS.md](TIPS.md) | Auth and stack order |
| [SECURITY.md](SECURITY.md) | Authorization and bounds |
| [WIPE-BUG.md](WIPE-BUG.md) | Partial maps erase siblings |
| [LEVEL-CONSISTENCY.md](LEVEL-CONSISTENCY.md) | Level formula |
| [TYPE-CHECK.md](TYPE-CHECK.md) | uint32 vs string |
| [COLLECTION-AUTH.md](COLLECTION-AUTH.md) | Collection editor |
| [SECONDARY-PERMISSION.md](SECONDARY-PERMISSION.md) | Owner auth limits |
| [DESERIALIZER.md](DESERIALIZER.md) | Bytes before mutate |
| [PRODUCTION-SEQUENCE.md](PRODUCTION-SEQUENCE.md) / [PRODUCTION-CHECKLIST.md](PRODUCTION-CHECKLIST.md) | Deployment order |
| [SOURCES.md](SOURCES.md) | Official links |

## Composition

Multi-gain lifecycle: nickname survives, level tracks XP, durability drains to broken, partial wipe drops nickname while merge does not, failed unauthorized attempt leaves map valid for retry.

## What is true (executed)

- Authorized: xp 50, level 1, durability 10, nickname oak, gain 50 → xp 100, level 2, durability 9, nickname oak.
- Unauthorized / non-chain previous / level mismatch / broken / bad gain / xp cap / new key / bad types → refused.
- Partial update map without nickname is the wipe case.

## Earlier layers

| Layer | Repo |
| --- | --- |
| 1–4 | deserialize · safe-partial · primitives · vectors |

## C++ sketch

`contracts/src/px_mutable_engine.cpp` mirrors numeric checks. Asset-row read, deserializer, collection-editor list, and `setassetdata` send remain stubs until compiled via [wax-contract-compiler](https://github.com/pixel-journey/wax-contract-compiler). TypeScript tests are the executable rule here.

```bash
npm test
```

MIT — Pixel Journey
