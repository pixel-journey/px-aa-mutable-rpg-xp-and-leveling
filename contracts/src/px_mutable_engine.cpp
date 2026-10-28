#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>
#include <eosio/action.hpp>

using namespace eosio;

// Educational sketch for a safe AtomicAssets mutable update.
// Tested rule: invariants/mutable-xp.ts (npm test).
// Unsigned action body: client/setassetdata-action.ts (same rule).
// This file has not been compiled. It has not been shown to match the test.
// The real atomicassets.hpp and atomicdata.hpp are not vendored here.
// Do not deploy.
//
// The wipe bug this example exists to prevent:
//   setassetdata replaces the entire stored map. A map that contains only
//   the keys you changed erases every other key.
//
// This sketch shows the structure of the production steps.
// It still cannot be compiled until the AtomicAssets headers are present
// and a deterministic CDT build is run.
// There is no caller-supplied durability_cost. The tested rule always subtracts 1.
// xp, level, and durability are uint32 in the tested rule. Do not narrow them to uint16.

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

    [[eosio::action]]
    void questcomplete(name asset_owner, uint64_t asset_id, uint32_t xp_gained) {
        require_auth(asset_owner);
        check(xp_gained >= 1 && xp_gained <= 10000, "bad gain");

        // Collection editor check is not implemented.
        // check(is_authorized_editor(collection_name, get_self()), "not editor");

        // Asset-row read is not implemented. Do not substitute zeros and call that a read.
        // const auto& asset = assets.get(asset_id, "asset not found");
        // const auto& schema = schemas.get(asset.schema_name.value, "schema not found");
        // ATTRIBUTE_MAP mdata = atomicdata::deserialize(asset.mutable_serialized_data, schema.format);
        //
        // Before arithmetic, each numeric key must be the uint32 alternative:
        //   check(holds_alternative<uint32_t>(mdata["xp"]), "bad xp");
        // A string must not be coerced. Nickname stays a string and is copied through.

        // The values below are not a chain row. The level check on them is not a demonstration.
        // Delete this block when the deserialize above is real.
        const uint32_t current_xp = 0;
        const uint32_t current_level = 1;
        const uint32_t durability = 100;
        check(current_level == 1u + (current_xp / 100u), "level mismatch");
        check(durability >= 1, "broken");
        const uint32_t next_durability = durability - 1;
        const uint32_t next_xp = current_xp + xp_gained;
        const uint32_t next_level = 1u + (next_xp / 100u);

        // Full-map write is not implemented. Never send only the keys you touched.
        // action(
        //   permission_level{get_self(), "active"_n},
        //   "atomicassets"_n, "setassetdata"_n,
        //   std::make_tuple(get_self(), asset_owner, asset_id, mdata)
        // ).send();

        (void)asset_id;
        (void)next_durability;
        (void)next_level;
        (void)next_xp;
    }
};
