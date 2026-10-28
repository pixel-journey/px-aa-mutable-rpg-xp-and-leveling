# Security notes — AtomicAssets mutable update

## Authorization

- The caller must be authorized to edit the asset (collection author or asset owner with the correct secondary permission).
- Previous mutable state must be read from the `atomicassets` asset row. Never accept a caller-supplied previous map.
- The contract must not write a map that adds keys the schema does not declare.

## Inputs and bounds

- XP gain must be a positive integer from 1 to 10000.
- Gain must not push xp outside uint32.
- Durability must not go negative.
- Stored level must already match the formula derived from current xp; a mismatch is refused.
- A partial map (missing sibling keys) is a data-loss bug and must be refused by construction.

## State integrity

`setassetdata` replaces the entire stored map. The only safe pattern is: read → deserialize → mutate selected keys → write the complete map.

## What the tested rule covers

`npm test` runs `invariants/mutable-xp.test.ts`.

- Authorized editor may apply a gain that keeps sibling keys.
- Unauthorized caller is refused.
- Previous map that is not marked as coming from the chain is refused.
- Broken (durability 0) is refused.
- Level mismatch is refused.
- Gain outside 1–10000 is refused.
- XP that would exceed uint32 is refused.
- Partial map drops omitted keys; merge preserves them.
- New key is refused.

## Current status

The TypeScript rule exists and now includes both the editor authorization check and the requirement that previous state come from the chain. The AtomicAssets deserializer and the `setassetdata` inline action are not in this repository. The C++ sketch is uncompiled and disagrees with the test in places. The test is the rule.
