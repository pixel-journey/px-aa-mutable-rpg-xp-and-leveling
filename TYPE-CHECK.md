# Type check before arithmetic

AtomicAssets mutable values are a variant. A key named `xp` can legally hold a string if the schema says so, or if the stored bytes were written by a different contract.

## Why the check exists

Reading a string with `std::get<uint32_t>` aborts the transaction. Coercing `"50"` into a number lets a forged or mismatched schema drive the level formula. The safe pattern is:

1. Confirm the alternative is the expected type (`holds_alternative`).
2. Only then extract the value.
3. Refuse anything else with a clear error.

## What the tested rule does

`requireUint32` refuses a missing value, a string, a non-integer, a negative number, and a value above uint32 max. `applyGain` uses it for `xp`, `level`, and `durability` before any arithmetic.

Nickname stays a string and is never passed through `requireUint32`. It is preserved by the full-map merge.

## What is not yet shown

The real `atomicdata::deserialize` and `holds_alternative` call are not in the C++ sketch. `requireUint32` is the educational stand-in until those headers are vendored and a deterministic build matches this rule.
