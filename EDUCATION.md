# Education

Example of a safe mutable-data update for an AtomicAssets NFT before calling `setassetdata`.

## Why the full map must be written

`setassetdata` replaces the entire stored mutable map with the map you supply. If you send only the keys you intend to change, every other key is erased. That is a silent data-loss bug. The tested rule demonstrates both the correct full-map result and the wipe that occurs with a partial map.

See WIPE-BUG.md for the short demonstration.

## Authorization and previous state

The tested rule refuses:

- A caller who is not the authorized editor.
- A previous map that is not marked as coming from the chain.

On a real contract the previous map must be read from the `atomicassets` asset row. Accepting a caller-supplied previous map lets an attacker forge xp or level. The `source: "chain"` marker in the rule is an educational stand-in for that read.

## Bounds and negative inputs

The tested rule also refuses:

- A gain of 0 or a negative gain.
- A gain large enough to push xp outside uint32.
- A durability that would go negative.
- A level that does not already match the formula derived from the current xp.

These refusals exist so that a malicious or mistaken caller cannot wrap a counter, create an inconsistent level, or drive durability below zero.

See LEVEL-CONSISTENCY.md for the level check.

## What the sketch now shows

`contracts/src/px_mutable_engine.cpp` is uncompiled. It now contains the structure of the full production sequence:

- Authentication.
- Collection editor check (commented placeholder).
- Asset-row read (placeholder type).
- Schema read (placeholder type).
- Deserialize step (commented).
- Level-consistency check (active code that matches the tested rule).
- Gain application with the fixed durability cost of 1.
- Full-map `setassetdata` call (commented).

The real AtomicAssets headers are not vendored. A deterministic CDT build has not been run. The test is the rule until a build matches it.

## Attack surface to keep closed

- Partial map writes (data wipe).
- Caller-controlled previous state (forged xp/level).
- Missing authorization on the editor.
- Unchecked arithmetic on xp or durability.
- Adding keys that the schema does not declare.
