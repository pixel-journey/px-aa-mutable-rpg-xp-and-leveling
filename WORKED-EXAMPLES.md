# Worked examples — RPG mutable gain

`XP_PER_LEVEL = 100`, `XP_GAIN_MAX = 10000`. Editor under test `collection.author`. Previous map must be `source: "chain"`.

## Level table

| xp | expectedLevel |
| --- | --- |
| 0 | 1 |
| 99 | 1 |
| 100 | 2 |

## Single gain

```text
{ xp: 50, level: 1, durability: 10, nickname: "oak" }
+ gain 50
→ { xp: 100, level: 2, durability: 9, nickname: "oak" }
```

Each successful gain subtracts **exactly one** durability.

## Composition — three gains

Start `{ xp: 0, level: 1, durability: 5, nickname: "oak" }`:

| Gain | xp | level | durability | nickname |
| --- | --- | --- | --- | --- |
| +40 | 40 | 1 | 4 | oak |
| +60 | 100 | 2 | 3 | oak |
| +50 | 150 | 2 | 2 | oak |

## Broken

Start durability 2, nickname pine: two gains → durability **0**; third throws `broken`; nickname still pine.

## Wipe vs merge

`wipedMap({ xp, level, durability })` **drops** nickname. `mergeMutable` / `applyGain` keep it. `mergeMutable` refuses a **new key** such as `title`.

## Refusals

| Case | Error |
| --- | --- |
| caller alice | authorized editor |
| previous.source caller | chain |
| level 4 with xp 50 | level mismatch |
| gain 0 / 10001 / -1 / 1.5 | bad gain |
| gain 10000 | accepted |
| xp near uint32 max + overflow | xp cap |
| string xp | bad xp |

Failed unauthorized call leaves prior map valid for a correct retry (composition).

Unsigned `setassetdata` body in `client/` does not broadcast.
