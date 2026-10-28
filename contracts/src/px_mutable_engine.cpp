#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>

using namespace eosio;

// Educational sketch for a safe AtomicAssets mutable update.
// Tested rule: invariants/mutable-xp.ts (npm test).
// This file has not been compiled. It has not been shown to match the test.
// Do not deploy.
//
// The wipe bug this example exists to prevent:
//   setassetdata replaces the entire stored map. A map that contains only
//   the keys you changed erases every other key.
//
// Remaining gaps versus the tested rule:
//   - No asset-row read (previous must come from chain).
//   - No AtomicAssets deserializer.
//   - No setassetdata inline call that writes the full map.
//   - Editor authorization is only require_auth(asset_owner); collection editor list is not checked.
CONTRACT px_mutable_engine : public contract {
public:
    using contract::contract;

    // Gain is fixed at the tested maximum of 10000.
    // Durability always decreases by 1 (the tested rule does not accept a caller-supplied cost).
    [[eosio::action]]
    void questcomplete(name asset_owner, uint64_t asset_id, uint32_t xp_gained) {
        // Authorization is incomplete. A production contract must also confirm
        // the caller is an authorized editor for the collection.
        require_auth(asset_owner);
        check(xp_gained >= 1 && xp_gained <= 10000, "bad gain");

        // Production steps not yet written:
        // 1. Read assets table scoped by asset_owner on atomicassets.
        // 2. Read schemas table scoped by collection_name.
        // 3. ATTRIBUTE_MAP mdata = atomicdata::deserialize(...).
        // 4. holds_alternative<T> before std::get<T>.
        // 5. Confirm stored level already matches 1 + floor(xp / 100).
        // 6. Mutate only existing keys (xp, level, durability).
        // 7. Write the FULL map back via setassetdata.

        // Placeholder values. Real code must read these from the deserialized map.
        uint32_t current_xp = 0;
        uint16_t current_level = 1;
        uint16_t durability = 100;
        check(durability >= 1, "broken");

        durability = static_cast<uint16_t>(durability - 1);
        current_xp += xp_gained;
        uint16_t new_level = static_cast<uint16_t>(1 + (current_xp / 100));
        current_level = new_level;

        (void)asset_id;
        (void)current_level;

        // Never construct a fresh map with only the keys you touched.
        // action(..., "atomicassets"_n, "setassetdata"_n, std::make_tuple(...)).send();
    }
};
