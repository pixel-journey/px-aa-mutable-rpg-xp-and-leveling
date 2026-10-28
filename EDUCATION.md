# Education

Quest 025. The tested rule is the full-map mutate step before `atomicassets::setassetdata`.

## The pitfall

`setassetdata` replaces the stored mutable map with the map you send. A map that contains only the keys you changed drops every other key. That is the wipe.

## The rule that was executed

- Starting map: xp 50, level 1, durability 10, nickname oak.
- Gain 50 → xp 100, level 2, durability 9, nickname oak.
- Level must already be `1 + floor(xp / 100)`. A mismatch is refused.
- Durability 0 is refused.
- A partial map that omits nickname does not contain nickname.
- A new key is refused.

`npm test` runs that rule. It does not read an asset and it does not call `setassetdata`.

## What a contract must do

On chain the previous map must come from the asset row, not from the caller. The AtomicAssets byte deserializer is not in this repository. Do not deploy a contract that trusts the user for previous state.

## Sketch

`contracts/src/px_mutable_engine.cpp` is uncompiled. It disagrees with the test in places. The test is the rule.
