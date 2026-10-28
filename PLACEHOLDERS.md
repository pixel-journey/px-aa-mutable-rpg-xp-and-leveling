# Placeholder types in the sketch

`contracts/src/px_mutable_engine.cpp` uses placeholder structs for the asset row and the schema row.

## Why they exist

The real types live in `atomicassets.hpp`. That header is not vendored in this repository. The placeholders let the sketch show the shape of the production sequence without claiming that the code can be compiled today.

## What a real build requires

- Include or vendor `atomicassets.hpp` and `atomicdata.hpp`.
- Replace the placeholders with the real `assets` and `schemas` multi_index tables.
- Replace the commented deserialize and `setassetdata` calls with the real ones.
- Run the deterministic CDT workflow and confirm the wasm matches the tested rule.

Until those steps are done, the sketch is educational structure only.
