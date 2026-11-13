# Tips — RPG mutables on AtomicAssets

## Do

- Follow the stack: deserialize → full-map patch → type checks → gain rule.
- Store **level** only if you also **verify** it against XP on every write.
- Use collection **authorized_editor** (or your game account) for XP grants — not random asset owners — unless the product is player-driven cosmetics only.
- Decrement durability (or another anti-spam resource) on gain if you need rate limits on-chain.

## Don’t

- Send only `{ xp, level }` to `setassetdata`.
- Trust client JSON as `previous`.
- Allow level to drift from `1 + floor(xp / XP_PER_LEVEL)`.
- Confuse owner auth with collection auth ([COLLECTION-AUTH.md](COLLECTION-AUTH.md), [SECONDARY-PERMISSION.md](SECONDARY-PERMISSION.md)).

## Companion notes in this repo

WIPE-BUG · LEVEL-CONSISTENCY · TYPE-CHECK · DESERIALIZER · PRODUCTION-CHECKLIST · PRODUCTION-SEQUENCE

## Stack

[L1 deserialize](https://github.com/pixel-journey/px-aa-mutable-deserialize-core) → [L2 partial](https://github.com/pixel-journey/px-aa-mutable-safe-partial-updater) → [L3 types](https://github.com/pixel-journey/px-aa-mutable-all-primitive-types) → [L4 vectors](https://github.com/pixel-journey/px-aa-mutable-vector-arrays-crud) → **L5 this lab**
