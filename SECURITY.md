# Security notes — AtomicAssets mutable update

## Authorization

- The caller must be authorized to edit the asset (collection author or asset owner with the correct secondary permission).
- Previous mutable state must be read from the `atomicassets` asset row. Never accept a caller-supplied previous map.
- Do not stamp `source: "chain"` inside the client. That marker is only honest after a real asset-row read.
- The contract must not write a map that adds keys the schema does not declare, or that drops a key the schema requires.

## Inputs and bounds

- XP gain must be a positive integer from 1 to 10000.
- Gain must not push xp outside uint32.
- Durability must not go negative. The cost is fixed at 1. A caller-supplied cost is not part of this rule.
- Stored level must already match the formula derived from current xp; a mismatch is refused.
- `xp`, `level`, and `durability` must already be uint32. A string, a float, a negative, or a missing value is refused before arithmetic.
- Asset id `0` is refused. Account names must be Antelope names.
- A partial map (missing sibling keys) is a data-loss bug and must be refused by construction.

## State integrity

`setassetdata` replaces the entire stored map. The only safe pattern is: read → deserialize → confirm types → mutate selected keys → write the complete map.

## What the tested rule covers

`npm test` runs `invariants/mutable-xp.test.ts` and `client/setassetdata-action.test.ts`.

- Authorized editor may apply a gain that keeps sibling keys, including in the unsigned `setassetdata` body.
- Unauthorized caller is refused before that body is built.
- Previous map that is not marked as coming from the chain is refused.
- Broken (durability 0) is refused.
- Level mismatch is refused.
- Gain outside 1–10000 is refused, including negative and non-integer.
- A string stored as xp is refused.
- XP that would exceed uint32 is refused.
- Partial map drops omitted keys; merge preserves them.
- A type map or stored map that drops nickname is refused.
- New key is refused. Asset id 0 is refused.

## Current status

The TypeScript rule and the unsigned action body agree. The C++ sketch uses uint32 and no durability-cost argument, but the asset read, deserializer, editor list, and `setassetdata` send are still comments. Headers are not vendored. No wasm has been built. The test is the rule until that build matches it.
