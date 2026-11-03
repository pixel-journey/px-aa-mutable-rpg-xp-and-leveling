# Education — RPG XP on a full mutable map

> **Rung:** `npm test` passes. `contracts/src/px_mutable_engine.cpp` is an **uncompiled sketch**. Headers are not vendored. The unsigned `setassetdata` body is a client test, not a broadcast.  
> **The test is the rule.**

`px-aa-mutable-safe-partial-updater` teaches "copy the map, then set one key." This repo adds the game rule on top: XP, level, durability, and a refusal to invent keys.

## What you should be able to do

| Level | After this file |
| --- | --- |
| Beginner | Add 50 XP to `{ xp: 50, level: 1, durability: 10, nickname: "oak" }` and keep the nickname |
| Intermediate | Refuse a bad level, a string XP, a broken item, and a caller who is not the editor |
| Masterclass | Explain why `source: "chain"` is still only a tag, and why a new key is refused here but not in the partial-updater lab |

---

## Beginner — one scene

The row is `xp 50`, `level 1`, `durability 10`, `nickname "oak"`. The authorized editor is `collection.author`. Gain is 50.

```text
expected level = 1 + floor(xp / 100)
next xp        = 100
next level     = 2
durability     = 9
nickname       = "oak"
```

The test deep-equals that object.

`expectedLevel(0)` and `expectedLevel(99)` are 1. `expectedLevel(100)` is 2.

A partial write `{ xp: 51, level: 1, durability: 9 }` does **not** contain `nickname`. `wipedMap` is that mistake, on purpose. `mergeMutable(row, { xp: 51 })` still has nickname `"oak"`.

### Words

| Word | Meaning here |
| --- | --- |
| Chain previous | `{ source: "chain", map }`. Any other source string throws |
| Editor | Must equal `authorizedEditor`. The test uses the collection author, not the NFT owner |
| Gain | Integer 1..10000 |
| `requireUint32` | Integer number, 0..`0xffffffff`. A string `"50"` throws `bad xp` |
| New key | `mergeMutable` throws `new key` if the update names a key the previous map lacks |

### Predict, then run

```bash
npm test
```

1. Caller `alice` throws `not authorized editor`.
2. `source: "caller"` throws `previous must come from chain`.
3. Durability 0 throws `broken`. Level 4 on 50 XP throws `level mismatch`.
4. Gain 0, -1, 1.5, and 10001 throw `bad gain`.

---

## Intermediate — order inside `applyGain`

1. Caller equals the authorized editor.
2. `previous.source` is exactly `"chain"`.
3. Gain is an integer from 1 to 10000.
4. `xp`, `level`, and `durability` each pass `requireUint32`.
5. Stored level equals `expectedLevel(xp)`. The row is not allowed to disagree with itself.
6. Durability is at least 1.
7. `xp + gain` does not pass `0xffffffff` (`xp cap`).
8. `mergeMutable` overlays `xp`, `level`, and `durability` onto a copy. Nickname survives because it was copied and not replaced.

The cap test uses `xp = 0xffffffff - 5` and gain 6. That is refused. The level on that row is `expectedLevel` of that xp, so the failure is the cap, not a level mismatch.

`mergeMutable` of an empty update is a copy. The function refuses a key that was not already there. The partial-updater lab **allows** adding `aura`. This lab does not. Do not mix those two policies.

### Attack → test

| Attack | Naive code | This lab | Test |
| --- | --- | --- | --- |
| Write only xp, level, durability | Nickname wiped | merge keeps `oak` | `a partial map drops the nickname` plus the gain test |
| Player calls the editor action | Anyone levels the NFT | `not authorized editor` | `unauthorized caller is refused` |
| User supplies the "old" map | They skip the chain read | `previous must come from chain` | source tag test |
| String in the uint32 slot | `std::get` on the wrong variant | `bad xp` | `a string stored where a uint32 is required` |
| Level 4 while xp is 50 | Display and math diverge | `level mismatch` | `a level that does not match xp` |
| Gain on durability 0 | Broken item still levels | `broken` | `a broken item is refused` |
| Invent a `title` key | Schema drift | `new key` | `a new key is refused` |

---

## Masterclass — the tag is not a table read

`source: "chain"` is a field the caller sets. The test passes `chain(row)` itself. A liar who sets the tag and also deletes `nickname` from `map` will get a merge that never had the nickname. The tag blocks the accidental `"caller"` path the test names. It does not fetch AtomicAssets.

On chain the sequence is still: load the asset in the action, deserialize, `holds_alternative` before `std::get` (this file's `requireUint32` is the stand-in), edit, write the **full** map. Collection authority is not the same check as NFT owner. This lab's editor is `collection.author` on purpose. Copying the owner-only check from the partial-updater lab would make this collection action fail.

`client/setassetdata-action.ts` builds an unsigned body. The client test checks that body. It does not send it.

The sketch is not a CDT artifact. Neighbor notes in this repo (`WIPE-BUG.md`, `TYPE-CHECK.md`, `COLLECTION-AUTH.md`) are commentary. If they ever disagree with `invariants/mutable-xp.test.ts`, the test wins.

### Exercise

1. XP 99 plus a legal gain of 1, level was 1, durability 10. Derived next level? (`expectedLevel(100) === 2`. The exact `applyGain` call is not a separate test, but both pieces are.)
2. Why does `wipedMap` exist if production must not call it? (So the test can show the bug. It is not the writer `applyGain` uses.)
3. Who is authorized in the happy test, the owner or the collection author? (The string `collection.author`.)

---

## What this course will not teach

- A live `setassetdata`
- That `source: "chain"` proves a table read
- That this merge policy (no new keys) is the partial-updater policy (it is not)
