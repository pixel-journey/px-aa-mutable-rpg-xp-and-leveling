# Worked examples — RPG mutable gain

Constants: `XP_PER_LEVEL = 100`, `XP_GAIN_MAX = 10000`.

## Example A — level up with nickname preserved

```text
previous (chain): { xp: 50, level: 1, durability: 10, nickname: "oak" }
applyGain(authorized, gain: 50)
→ { xp: 100, level: 2, durability: 9, nickname: "oak" }
```

## Example B — sequential gains (composition)

Multiple gains: nickname always present, level always `1 + floor(xp/100)`, durability decreases by 1 each time until **broken** (durability 0 refuses further gains).

## Example C — wipe vs merge

```text
wipedMap({ xp: 100, level: 2 })  // missing nickname → wipe
mergeMutable(previous, { xp, level, durability })  // siblings kept
```

## Example D — refused paths

| Case | Error |
| --- | --- |
| caller ≠ authorizedEditor | not authorized editor |
| previous.source ≠ "chain" | previous must come from chain |
| level ≠ expectedLevel(xp) | level mismatch |
| durability < 1 | broken |
| gain out of 1..10000 | bad gain |
| xp + gain > uint32 max | xp cap |
| update introduces new key | new key |
| string where uint32 required | bad xp/level/durability |

## Example E — unauthorized does not mutate

Failed `applyGain` leaves the prior map valid for a correct retry (composition).

## Example F — unsigned client body

`client/setassetdata-action.ts` builds an **unsigned** `setassetdata` shape from the merged map. It does not broadcast.
