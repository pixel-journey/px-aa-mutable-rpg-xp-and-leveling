# Official sources

This lab is the **mutate** step before a real `setassetdata`. It does not read tables or broadcast.

## AtomicAssets / WAX

| Source | Use |
| --- | --- |
| [atomicassets-contract `setassetdata`](https://github.com/pinknetworkx/atomicassets-contract/blob/master/src/atomicassets.cpp) | Authorized editor; full `new_mutable_data` |
| [Serialization wiki](https://github.com/pinknetworkx/atomicassets-contract/wiki/Serialization) | Bytes + schema before mutation |
| [WAX: Modifying mutable data](https://docs.wax.io/build/tutorials/howto_atomicassets/mutabledata) | editor, owner, asset_id, ATTRIBUTE_MAP |
| [WAX: How-To AtomicAssets](https://docs.wax.io/build/tutorials/howto_atomicassets) | Standard overview |
| [WAX: Minting NFTs](https://docs.wax.io/build/tutorials/howto_atomicassets/mint_nft) | Mutable vs immutable at mint |
| [atomicassets-sdk](https://github.com/atomicassets/atomicassets-sdk) | Official TS read / serialize / v2 |
| [COLLECTION-AUTH.md](COLLECTION-AUTH.md) | Why owner-only is insufficient for game XP |

## WharfKit (when a host later signs)

| Source | Use |
| --- | --- |
| [WharfKit](https://wharfkit.com/) | SessionKit `transact` |
| [@wharfkit/atomicassets](https://www.npmjs.com/package/@wharfkit/atomicassets) | Typed asset / schema reads |
| [wharfkit/skill](https://github.com/wharfkit/skill) | Claude Code skill: Session, Contract, patterns |
| [@wharfkit/cli](https://www.npmjs.com/package/@wharfkit/cli) | Generate typed `atomicassets` contract helpers |
| [@wharfkit/starter-wax](https://www.npmjs.com/package/@wharfkit/starter-wax) | WAX-preconfigured SessionKit |

```bash
git clone https://github.com/wharfkit/skill.git ~/.claude/skills/wharfkit
npx @wharfkit/cli generate atomicassets
```

## Product facts locked by this lab

- Level must **agree** with XP under the curve the tests lock.
- A **new key** that was not on the previous map is refused.
- The write is a **full map** (carry siblings).
- This file mutates a map in memory — not a broadcast.

## Stack position

Layer **5 of 5**. Path: [MUTABLE-STACK.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/MUTABLE-STACK.md).

| Layer | Repo |
| --- | --- |
| 1 | [deserialize-core](https://github.com/pixel-journey/px-aa-mutable-deserialize-core) |
| 2 | [safe partial updater](https://github.com/pixel-journey/px-aa-mutable-safe-partial-updater) |
| 3 | [all-primitive-types](https://github.com/pixel-journey/px-aa-mutable-all-primitive-types) |
| 4 | [vector-arrays-crud](https://github.com/pixel-journey/px-aa-mutable-vector-arrays-crud) |
| 5 | **This lab** |

Shared pure gates: [px-invariant-kit](https://github.com/pixel-journey/px-invariant-kit).
