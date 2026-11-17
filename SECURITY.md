# Security — RPG XP on a full mutable map

## Closed in tests

| Issue | Behavior |
| --- | --- |
| Unauthorized caller | refused before body is built |
| Previous not marked chain | refused |
| Durability 0 | broken |
| Level ≠ `1 + floor(xp / 100)` | level mismatch |
| Gain outside 1–10000 / non-integer | refused |
| String where uint32 required | bad xp |
| XP past uint32 | refused |
| Partial map omitting nickname | demonstrated wipe; merge preserves siblings |
| New key not in previous map | refused |
| Asset id 0 | refused |

Authorized editor may apply a gain that keeps sibling keys, including in the unsigned `setassetdata` body.

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| Auth | Collection author / authorized editors — real `require_auth`, not a string |
| Previous map | Load from AtomicAssets asset row inside the action |
| Schema | Do not invent keys the schema does not declare |
| Type check | `holds_alternative` before `std::get` |
| Write | Full map only — `setassetdata` replaces the whole map |
| Wasm | C++ sketch is uncompiled; headers not vendored |

## Attack angles

1. Sending only `{ xp, level, durability }` (nickname dies).  
2. Client-supplied previous map stamped `source: "chain"`.  
3. Owner-only auth when the collection must level the NFT.  
4. Storing XP as a string and later `std::get` a uint32.  
5. Mixing this lab's **no new keys** policy with the partial-updater's **allow add** policy.

## Honesty limits

`source: "chain"` is a tag the test sets — not a table read. Companion notes (WIPE-BUG, COLLECTION-AUTH, …) yield to `npm test` if they disagree. Official: [atomicassets-contract](https://github.com/pinknetworkx/atomicassets-contract) · [mutable data](https://docs.wax.io/build/tutorials/howto_atomicassets/mutabledata). Stack: [MUTABLE-STACK](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/MUTABLE-STACK.md).
