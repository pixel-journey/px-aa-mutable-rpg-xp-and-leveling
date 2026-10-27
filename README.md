# px-aa-mutable-rpg-xp-and-leveling

Quest 025. Tier B. Quest XP, level from XP / 1000, durability, and an aura tier at level 10.

## Read this before you compile

`contracts/src/px_mutable_engine.cpp` is the state machine and the bounds checks. It does **not** call `setassetdata`. It compiles without a snapshot of `atomicassets.hpp` / `atomicdata.hpp`.

Production code vendors those headers and does this, in order:

1. Load the asset from `atomicassets` scoped by `asset_owner`.
2. Load the schema from the collection scope and read `format`.
3. `ATTRIBUTE_MAP mdata = atomicdata::deserialize(mutable_serialized_data, format)`.
4. `holds_alternative<T>` before `std::get<T>` on every field.
5. Edit the keys you mean to change.
6. Send `setassetdata` with the **whole** map.

A fresh map that contains only `xp` deletes durability, aura, and every other mutable field. That is the bug this quest exists to prevent.

`get_self()` must be listed in the collection's authorized accounts or `setassetdata` rejects the write.

Do not treat the comments in the cpp file as a completed integration.

## Vectors

PX-VEC-06 schema drift and partial-map wipes.

Private while the vector suite is open.
