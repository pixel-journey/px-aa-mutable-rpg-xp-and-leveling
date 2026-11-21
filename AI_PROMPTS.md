# AI handoff — mutable RPG XP layer

Use this file when an agent extends or integrates this lab. Prefer facts locked by tests over README marketing.

## Install agent tooling first

```bash
# WharfKit skill for Claude Code (SessionKit, ContractKit, patterns)
git clone https://github.com/wharfkit/skill.git ~/.claude/skills/wharfkit

# Optional: typed contract helpers
npx @wharfkit/cli generate atomicassets
```

Packages hosts usually need later (not required for pure map tests):

- `@wharfkit/session` / `@wharfkit/starter-wax`
- `@wharfkit/atomicassets` or [atomicassets-sdk](https://github.com/atomicassets/atomicassets-sdk)

## Non-negotiables

1. **Full-map write** — never serialize only the changed keys (see [WIPE-BUG.md](WIPE-BUG.md)).
2. **Level ↔ XP** — level bump without XP is refused by tests.
3. **No new keys** at this layer — schema discipline; add keys only if schema + tests change.
4. **Chain previous** — production must load asset row on-contract; never trust client `previous`.
5. **Collection auth** for game XP — not owner-only ([COLLECTION-AUTH.md](COLLECTION-AUTH.md)).
6. Prefer **WharfKit SessionKit** over legacy eosjs / Anchor Link defaults.

## Stack order

1. [deserialize-core](https://github.com/pixel-journey/px-aa-mutable-deserialize-core)  
2. [safe-partial-updater](https://github.com/pixel-journey/px-aa-mutable-safe-partial-updater)  
3. [all-primitive-types](https://github.com/pixel-journey/px-aa-mutable-all-primitive-types)  
4. [vector-arrays-crud](https://github.com/pixel-journey/px-aa-mutable-vector-arrays-crud)  
5. **this lab**

Index: [MUTABLE-STACK.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/MUTABLE-STACK.md)

## Prompt seeds (safe)

- "Extend `applyXp` so level stays consistent with the tested curve; do not invent new mutable keys."
- "Show a full-map patch that updates XP and preserves nickname using safe-partial patterns."
- "List setassetdata args from docs.wax.io; mark which of our pure functions map to which step."
- "Do not call this lab a live chain write. Draft a host integration checklist using WharfKit SessionKit only."

## Do not

- Open a new micro-repo for one scalar rule.
- Claim `backasset` works on AtomicAssets v2 for new locks.
- Put private keys or project decrypt keys in client prompts.
