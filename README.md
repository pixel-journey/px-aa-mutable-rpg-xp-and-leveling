# px-aa-mutable-rpg-xp-and-leveling

The mutate step before `atomicassets::setassetdata`. Private. Not deployed. The chain was not written.

Quest 025 in the vault index. The tested rule is `invariants/mutable-xp.ts`.

## What is true

`setassetdata` on WAX `atomicassets` (ABI read 2026-10-27, contract version reported as 2.0.0 by the Atomic API config) takes `authorized_editor`, `asset_owner`, `asset_id`, and `new_mutable_data`. The client notes for that action say the map you send replaces the stored map. This repo does not re-check that by sending a transaction.

The tested rule:

- `xp` 50, `level` 1, `durability` 10, `nickname` oak, gain 50 → xp 100, level 2, durability 9, nickname oak.
- Level must already be `1 + floor(xp / 100)`. A mismatch is refused.
- Durability 0 is refused. One gain subtracts 1.
- Gain is an integer from 1 to 10000. xp must stay inside uint32.
- A map that contains only the changed keys does not contain `nickname`. That is the wipe.
- A new key is refused. Adding a schema attribute is not this action.

`gainAction` builds an unsigned action. It does not read the asset, so the caller supplies `previous`. On a contract, previous has to come from the asset row. That read and the AtomicAssets byte deserializer are not in this repo. Do not deploy a contract that trusts the user for `previous`.

Sorted keys in the example are for a stable test. Sort order is not a chain rule.

## Run

```bash
npm test
```

No host is called.

## Uncompiled sketch

`contracts/src/px_mutable_engine.cpp` does not implement `applyGain` and does not call `setassetdata`. `npm test` does not read it. It was not compiled.

The sketch allows an XP gain up to 100000 and a caller-supplied durability cost. The test does not. The sketch derives level without checking that the stored level already matched. The test refuses a mismatch. Do not treat the file as the integration.
