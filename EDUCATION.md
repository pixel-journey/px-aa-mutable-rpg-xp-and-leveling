# Education

Example of a safe mutable-data update for an AtomicAssets NFT before calling `setassetdata`.

## Why the full map must be written

`setassetdata` replaces the entire stored mutable map with the map you supply. If you send only the keys you intend to change, every other key is erased. That is a silent data-loss bug. The tested rule demonstrates both the correct full-map result and the wipe that occurs with a partial map.

## Authorization

On chain the caller must be authorized to edit the asset (typically the collection author or the asset owner with the appropriate secondary permission). This repository does not yet implement that check because it does not read the asset row. A production contract must:

- Read the asset from the `atomicassets` table.
- Confirm the caller is allowed to edit it.
- Deserialize the existing mutable data.
- Mutate only the intended keys.
- Write the complete map back.

Never accept a caller-supplied previous map. The previous state must come from the chain.

## Bounds and negative inputs

The tested rule refuses:

- A gain of 0 or a negative gain.
- A gain large enough to push xp outside uint32.
- A durability that would go negative.
- A level that does not already match the formula derived from the current xp.

These refusals exist so that a malicious or mistaken caller cannot wrap a counter, create an inconsistent level, or drive durability below zero.

## What is not yet done

The AtomicAssets deserializer and the actual `setassetdata` inline action are not in this repository. The C++ sketch is uncompiled and disagrees with the test in places. The test is the rule until a deterministic build exists.

## Attack surface to keep closed

- Partial map writes (data wipe).
- Caller-controlled previous state (forged xp/level).
- Missing authorization on the editor.
- Unchecked arithmetic on xp or durability.
- Adding keys that the schema does not declare.
