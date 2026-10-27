#include <eosio/eosio.hpp>
#include <eosio/asset.hpp>

using namespace eosio;

// Quest: px-aa-mutable-rpg-xp-and-leveling
//
// Production code vendors atomicassets.hpp and atomicdata.hpp and calls
// atomicdata::deserialize before setassetdata. This file keeps the state
// machine readable without pinning a header snapshot. The wipe bug is the
// point of the quest: a one-key map passed to setassetdata deletes every
// other mutable field.

struct attribute_map_note {
    // Stand-in for atomicassets::ATTRIBUTE_MAP.
    // Real code: std::map<std::string, std::variant<...>>
};

CONTRACT px_mutable_engine : public contract {
public:
    using contract::contract;

    [[eosio::action]]
    void questcomplete(name asset_owner, uint64_t asset_id, uint32_t xp_gained, uint16_t durability_cost) {
        require_auth(asset_owner);
        check(xp_gained <= 100000, "xp gain out of bounds");
        check(durability_cost <= 100, "durability cost out of bounds");

        // 1. assets table scoped by asset_owner.value on atomicassets
        // 2. schemas table scoped by collection_name.value
        // 3. ATTRIBUTE_MAP mdata = atomicdata::deserialize(mutable_serialized_data, format)
        // 4. holds_alternative<T> before std::get<T>
        // 5. write the FULL map back via setassetdata

        uint32_t current_xp = 0;       // get_or(mdata, "xp", 0)
        uint16_t current_level = 1;    // get_or(mdata, "level", 1)
        uint16_t durability = 100;     // get_or(mdata, "durability", 100)
        check(durability >= durability_cost, "repair required");

        durability = static_cast<uint16_t>(durability - durability_cost);
        current_xp += xp_gained;
        uint16_t new_level = static_cast<uint16_t>(1 + (current_xp / 1000));
        bool ascended = new_level >= 10 && new_level > current_level;
        current_level = new_level;

        // mdata["xp"] = current_xp;
        // mdata["level"] = current_level;
        // mdata["durability"] = durability;
        // if (ascended) mdata["aura_tier"] = "Ascended Pixel Glow";
        // Never construct a fresh map with only the keys you touched.
        (void)asset_id;
        (void)ascended;

        // action(
        //   permission_level{get_self(), "active"_n},
        //   "atomicassets"_n, "setassetdata"_n,
        //   std::make_tuple(get_self(), asset_owner, asset_id, mdata)
        // ).send();
        // get_self() must be in the collection's authorized_accounts.
    }
};
