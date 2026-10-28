# The mutable wipe bug

`atomicassets::setassetdata` replaces the entire stored mutable map with the map you supply.

## What goes wrong

If the map you send contains only the keys you intend to change, every other key is erased. A nickname, an equipment slot, or a quest flag that was not included disappears without an error.

## What the tested rule demonstrates

- `wipedMap` returns only the keys that were supplied. The nickname is gone.
- `mergeMutable` copies every existing key first, then overlays the updates. The nickname remains.
- A new key that was not already present is refused, so the contract cannot accidentally expand the schema.

## Production requirement

Read the full map, mutate only the intended keys, and write the complete map back. Never construct a fresh map that contains only the fields you touched.
