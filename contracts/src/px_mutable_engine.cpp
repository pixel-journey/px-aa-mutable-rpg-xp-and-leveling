#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>

using namespace eosio;

// Educational sketch for a safe AtomicAssets mutable update.
// Tested rule: invariants/mutable-xp.ts (npm test).
// This file has not been compiled. It disagrees with the test in places.
// Do not deploy.
//
// The wipe bug this example exists to prevent:
//   setassetdata replaces the entire stored map. A map that contains only
//   the keys you changed erases every other key.
//
// Disagreements with the tested rule (the test wins until a build matches):
//   - Sketch allows xp gain up to 100000; test refuses above 10000.
//   - Sketch accepts a caller-supplied durability cost; test always subtracts 1.
//   - Sketch derives level without checking that the stored level already matched.
//   - Sketch does not yet check that the caller is an authorized editor of the collection.
CONTRACT px_mutable_engine : public contract {
public:
    using contract::contract;

    [[eosio::action]]
    void questcomplete(name asset_owner, uint64_t asset_id, uint32_t xp_gained, uint16_t durability_cost) {
        // Authorization is incomplete. A production contract must also confirm
        // the caller is an authorized editor for the collection.
        require_auth(asset_owner);
        check(xp_gained <= 100000, "xp gain out of bounds");
        check(durability_cost <= 100, "durability cost out of bounds");

        // Production steps not yet written:
        // 1. Read assets table scoped by asset_owner on atomicassets.
        // 2. Read schemas table scoped by collection_name.
        // 3. ATTRIBUTE_MAP mdata = atomicdata::deserialize(...).
        // 4. holds_alternative<T> before std::get<T>.
        // 5. Mutate only existing keys.
        // 6. Write the FULL map back via setassetdata.

        uint32_t current_xp = 0;
        uint16_t current_level = 1;
        uint16_t durability = 100;
        check(durability >= durability_cost, "repair required");

        durability = static_cast<uint16_t>(durability - durability_cost);
        current_xp += xp_gained;
        uint16_t new_level = static_cast<uint16_t>(1 + (current_xp / 1000));
        current_level = new_level;

        (void)asset_id;
        (void)current_level;

        // Never construct a fresh map with only the keys you touched.
        // action(..., "atomicassets"_n, "setassetdata"_n, std::make_tuple(...)).send();
    }
};
