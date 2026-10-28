# AtomicAssets deserializer

Mutable data is stored as a serialized byte vector. The schema defines the format.

## What a production contract must do

1. Read the asset row from the `atomicassets` assets table.
2. Read the schema for that collection so the format is known.
3. Call `atomicdata::deserialize` on the mutable bytes.
4. Use `holds_alternative<T>` before `std::get<T>` so a wrong type does not abort the transaction.
5. Mutate only existing keys.
6. Serialize the full map and pass it to `setassetdata`.

## What this repository does not yet do

It does not vendor `atomicassets.hpp` or `atomicdata.hpp`. It does not perform the deserialize step. The tested rule operates on an already-deserialized map that is marked as coming from the chain.

Do not deploy a contract that skips the deserialize step or that trusts a caller-supplied map.
