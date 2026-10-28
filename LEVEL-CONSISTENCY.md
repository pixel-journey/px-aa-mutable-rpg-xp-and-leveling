# Level consistency

The tested rule derives level as `1 + floor(xp / 100)` and refuses a stored level that does not already match that formula.

## Why the check exists

If the contract blindly overwrites level from a new calculation without verifying the previous value, an attacker who could supply a forged previous map could force an inconsistent state. Even when previous comes from the chain, the check catches corrupted or partially-updated rows.

## What the rule does

- Reads xp and level from the chain-sourced previous map.
- Computes the expected level.
- Refuses the action if they differ.
- Only then applies the gain and writes the new consistent pair.

## What is not yet shown

The real AtomicAssets read that would supply the previous map is not in this repository. The check in the TypeScript rule is the educational demonstration.
