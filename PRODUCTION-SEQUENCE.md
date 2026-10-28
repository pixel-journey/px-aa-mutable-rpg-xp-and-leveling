# Production sequence

The safe order of operations for a mutable update is fixed.

1. Authenticate the caller.
2. Confirm the caller is an authorized editor for the collection.
3. Read the asset row from the `atomicassets` assets table.
4. Read the schema so the format is known.
5. Deserialize the mutable bytes.
6. Confirm the stored level already matches the formula derived from the stored xp.
7. Apply the gain (1–10000), subtract 1 from durability, and recompute level.
8. Refuse if durability would go below 0 or if xp would leave uint32.
9. Write the complete map back via `setassetdata`.

Any step that is skipped creates an attack surface. The tested rule demonstrates steps 1, 6, 7, and 8. The remaining steps are listed in PRODUCTION-CHECKLIST.md and are not yet implemented.
