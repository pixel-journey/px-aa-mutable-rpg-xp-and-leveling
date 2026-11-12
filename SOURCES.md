# Official sources

This lab is the **mutate** step before a real `setassetdata`. It does not read tables or broadcast.

| Source | Use |
| --- | --- |
| [atomicassets-contract `setassetdata`](https://github.com/pinknetworkx/atomicassets-contract/blob/master/src/atomicassets.cpp) | Requires authorized editor; deserializes old data; serializes **full** `new_mutable_data` |
| [Serialization wiki](https://github.com/pinknetworkx/atomicassets-contract/wiki/Serialization) | Why bytes and schema format matter before mutation |
| [WAX: Modifying mutable data](https://docs.wax.io/build/tutorials/howto_atomicassets/mutabledata) | Action args: editor, owner, asset_id, ATTRIBUTE_MAP |
| [WAX: How-To AtomicAssets](https://docs.wax.io/build/tutorials/howto_atomicassets) | Standard overview |
| [WAX: Minting NFTs](https://docs.wax.io/build/tutorials/howto_atomicassets/mint_nft) | Mutable vs immutable at mint time |

## Stack position

Layer **5 of 5**. Start at [deserialize-core](https://github.com/pixel-journey/px-aa-mutable-deserialize-core) if the bytes are unfamiliar. Path: [MUTABLE-STACK.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/MUTABLE-STACK.md).

Shared pure gates (name, string auth stand-in, math) belong in [px-invariant-kit](https://github.com/pixel-journey/px-invariant-kit), not as sibling one-check repos.
