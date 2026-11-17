# Tips — RPG XP on a full mutable map

## Do

- Walk the stack: deserialize, copy the full map, check types, then apply the gain.
- If you store `level`, recompute `1 + floor(xp / 100)` on every write and refuse a mismatch.
- Authorize the **collection editor** for XP grants. Owner-only is the partial-updater lab's teaching stand-in, and it blocks the collection from leveling an NFT the player holds.
- Drop durability (or another resource) on gain if you need an on-chain rate limit.

## Don't

- Send only `{ xp, level, durability }` to `setassetdata` (nickname dies).
- Trust client JSON as previous, even if `source` is the string `"chain"`.
- Invent keys this schema does not have. This lab refuses new keys. The partial updater allows an add. Do not mix the policies.
- Store XP as a string and `std::get` a uint32 later.

## Common mistakes

1. Level 4 while XP is still 50.
2. Gain on durability 0 (broken item).
3. Gain 0 or above 10000.
4. `xp + gain` past `0xffffffff`.
5. Copying owner-only auth into a collection-driven game.

## Nice-to-have extensions (not in this repo)

| Idea | Note |
| --- | --- |
| XP curve that is not linear | New `expectedLevel`; retest every boundary |
| Vector of buffs | [vector CRUD](https://github.com/pixel-journey/px-aa-mutable-vector-arrays-crud) |
| Cooldown between gains | [invariant kit](https://github.com/pixel-journey/px-invariant-kit) |
| RNG loot on level-up | After the map write succeeds, separate oracle job |

Stack: [L1](https://github.com/pixel-journey/px-aa-mutable-deserialize-core) → [L2](https://github.com/pixel-journey/px-aa-mutable-safe-partial-updater) → [L3](https://github.com/pixel-journey/px-aa-mutable-all-primitive-types) → [L4](https://github.com/pixel-journey/px-aa-mutable-vector-arrays-crud) → **L5 this lab**.

Notes in this repo: WIPE-BUG, LEVEL-CONSISTENCY, TYPE-CHECK, COLLECTION-AUTH.

Official: [atomicassets-contract](https://github.com/pinknetworkx/atomicassets-contract) · [WAX AtomicAssets](https://docs.wax.io/build/tutorials/howto_atomicassets).
