# Official sources

This lab is the **mutate** step before a real `setassetdata`. It does not read tables or broadcast.

| Source | Use |
| --- | --- |
| [atomicassets-contract `setassetdata`](https://github.com/pinknetworkx/atomicassets-contract/blob/master/src/atomicassets.cpp) | Requires authorized editor; deserializes old data; serializes **full** `new_mutable_data` |
| [Serialization wiki](https://github.com/pinknetworkx/atomicassets-contract/wiki/Serialization) | Why bytes and schema format matter before mutation |
| [WAX: Modifying mutable data](https://docs.wax.io/build/tutorials/howto_atomicassets/mutabledata) | Action args: editor, owner, asset_id, ATTRIBUTE_MAP |
| [WAX: How-To AtomicAssets](https://docs.wax.io/build/tutorials/howto_atomicassets) | Standard overview |
| [WAX: Minting NFTs](https://docs.wax.io/build/tutorials/howto_atomicassets/mint_nft) | Mutable vs immutable at mint time |

## Product facts locked by this lab

- Level must **agree** with XP under the curve the tests lock. A level bump without the XP is refused.
- A **new key** that was not on the previous map is refused (schema discipline).
- The write is a **full map**. Sibling keys that are not in the rule must still be carried ([safe partial](https://github.com/pixel-journey/px-aa-mutable-safe-partial-updater)).
- This file mutates a map in memory. It is not a broadcast and not a chain read.
- Do not open a new micro-repo for one scalar rule. Extend this layer or the kit.

## Stack position

Layer **5 of 5**. Start at [deserialize-core](https://github.com/pixel-journey/px-aa-mutable-deserialize-core) if the bytes are unfamiliar. Path: [MUTABLE-STACK.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/MUTABLE-STACK.md).

| Layer | Repo |
| --- | --- |
| 1 | [deserialize-core](https://github.com/pixel-journey/px-aa-mutable-deserialize-core) |
| 2 | [safe partial updater](https://github.com/pixel-journey/px-aa-mutable-safe-partial-updater) |
| 3 | [all-primitive-types](https://github.com/pixel-journey/px-aa-mutable-all-primitive-types) |
| 4 | [vector-arrays-crud](https://github.com/pixel-journey/px-aa-mutable-vector-arrays-crud) |
| 5 | **This lab** |

Shared pure gates belong in [px-invariant-kit](https://github.com/pixel-journey/px-invariant-kit), not as sibling one-check repos.
