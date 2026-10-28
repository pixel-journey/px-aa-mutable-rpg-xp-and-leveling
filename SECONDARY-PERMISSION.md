# Secondary permissions

AtomicAssets collection authorization is often expressed as a secondary permission (for example `collection@active` or a custom permission) rather than as the asset owner alone.

## What a production contract must do

- Confirm the caller holds the permission that the collection has authorized for mutable updates.
- Do not treat `require_auth(asset_owner)` as sufficient by itself.
- The tested rule currently models this as a simple string equality against `authorizedEditor`. That is an educational stand-in.

## What is not yet shown

No example in this repository demonstrates a real secondary-permission check against the AtomicAssets collection author list. That check belongs in the production path once the asset-row read is present.

Do not deploy a contract that skips the collection's authorized-editor list.
