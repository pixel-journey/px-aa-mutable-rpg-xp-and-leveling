# Collection authorization

On AtomicAssets the right to call `setassetdata` is controlled by the collection's authorized editors, not merely by the asset owner.

## What a production contract must check

- Read the asset row from the `atomicassets` table.
- Confirm the caller is listed as an authorized editor for that collection (or holds the appropriate secondary permission).
- Only then deserialize, mutate, and write the full map.

## What the tested rule now covers

`applyGain` refuses a caller who is not the authorized editor.

It also refuses a previous map that is not marked as coming from the chain. This is an educational stand-in for the real requirement that the previous state must be read from the asset row.

## What this repository still does not do

It does not read the AtomicAssets assets table. It does not deserialize the mutable bytes. It does not call `setassetdata`. Those steps are required before the pattern can be considered complete.

Do not deploy a contract that skips the collection authorization check or that trusts a caller-supplied previous map.
