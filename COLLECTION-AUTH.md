# Collection authorization

On AtomicAssets the right to call `setassetdata` is controlled by the collection's authorized editors, not merely by the asset owner.

## What a production contract must check

- Read the asset row from the `atomicassets` table.
- Confirm the caller is listed as an authorized editor for that collection (or holds the appropriate secondary permission).
- Only then deserialize, mutate, and write the full map.

## What this repository does not yet do

The tested rule assumes the previous map is already in hand. It does not read the asset table and it does not check collection permissions. Those steps are required before the pattern can be considered complete.

Do not deploy a contract that skips the collection authorization check.
