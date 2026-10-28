#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <eosio/action.hpp>

using namespace eosio;

// Educational sketch for a safe AtomicAssets mutable update.
// Tested rule: invariants/mutable-xp.ts (npm test).
// This file has not been compiled. It has not been shown to match the test.
// The real atomicassets.hpp and atomicdata.hpp are not vendored here.
// Do not deploy.
//
// The wipe bug this example exists to prevent:
//   setassetdata replaces the entire stored map. A map that contains only
//   the keys you changed erases every other key.
//
// This sketch now shows the structure of the remaining production steps.
// It still cannot be compiled until the AtomicAssets headers are present
// and a deterministic CDT build is run.

// Placeholder types. Real code uses the types from atomicassets.hpp.
struct asset_row_placeholder {
    uint64_t asset_id;
    name collection_name;
    // std::vector<uint8_t> mutable_serialized_data;
};

struct schema_row_placeholder {
    name schema_name;
    // std::vector<FORMAT> format;
};

CONTRACT px_mutable_engine : public contract {
public:
    using contract::contract;

    // Gain is fixed at the tested maximum of 10000.
    // Durability always decreases by 1.
    [[eosio::action]]
    void questcomplete(name asset_owner, uint64_t asset_id, uint32_t xp_gained) {
        // 1. Authenticate.
        require_auth(asset_owner);
        check(xp_gained >= 1 && xp_gained <= 10000, "bad gain");

        // 2. Collection editor check (structure only).
        // Production: read the collection's authorized_accounts and confirm
        // the caller is listed or holds the correct secondary permission.
        // check(is_authorized_editor(collection_name, get_self()), "not editor");

        // 3. Asset-row read (structure only).
        // Production: assets table scoped by asset_owner on atomicassets.
        // const auto& asset = assets.get(asset_id, "asset not found");

        // 4. Schema read (structure only).
        // Production: schemas table scoped by collection_name.
        // const auto& schema = schemas.get(asset.schema_name.value, "schema not found");

        // 5. Deserialize (structure only).
        // Production:
        // ATTRIBUTE_MAP mdata = atomicdata::deserialize(
        //   asset.mutable_serialized_data, schema.format);

        // Placeholder values. Real code must read these from the deserialized map.
        uint32_t current_xp = 0;
        uint16_t current_level = 1;
        uint16_t durability = 100;

        // 6. Level-consistency check (matches the tested rule).
        uint16_t expected = static_cast<uint16_t>(1 + (current_xp / 100));
        check(current_level == expected, "level mismatch");

        // 7. Apply gain.
        check(durability >= 1, "broken");
        durability = static_cast<uint16_t>(durability - 1);
        current_xp += xp_gained;
        uint16_t new_level = static_cast<uint16_t>(1 + (current_xp / 100));

        // 8. Full-map write (structure only).
        // Production: mutate the existing map, then:
        // action(
        //   permission_level{get_self(), "active"_n},
        //   "atomicassets"_n, "setassetdata"_n,
        //   std::make_tuple(get_self(), asset_owner, asset_id, mdata)
        // ).send();
        // Never construct a fresh map that contains only the keys you touched.

        (void)asset_id;
        (void)new_level;
    }
};
