import { applyGain, type MutableMap } from "../invariants/mutable-xp.ts";

export type AttrType = "uint32" | "string";

export type Attribute = { key: string; value: ["uint32", number] | ["string", string] };

export type Action = {
  account: "atomicassets";
  name: "setassetdata";
  authorization: { actor: string; permission: "active" }[];
  data: {
    authorized_editor: string;
    asset_owner: string;
    asset_id: string;
    new_mutable_data: Attribute[];
  };
};

const NAME = /^[a-z1-5.]{1,12}$/;

function assertName(name: string): void {
  if (!NAME.test(name) || name.startsWith(".") || name.endsWith(".")) throw new Error("bad name");
}

/** Types must cover the merged map exactly. Missing a key here is how a wipe ships. */
export function toAttributeMap(full: MutableMap, types: Record<string, AttrType>): Attribute[] {
  const keys = Object.keys(full).sort();
  const typed = Object.keys(types).sort();
  if (keys.join("\0") !== typed.join("\0")) throw new Error("schema keys differ");
  return keys.map((key) => {
    const type = types[key];
    const value = full[key];
    if (type === "uint32") {
      if (typeof value !== "number" || !Number.isInteger(value) || value < 0 || value > 0xffffffff) {
        throw new Error("bad uint32");
      }
      return { key, value: ["uint32", value] };
    }
    if (typeof value !== "string") throw new Error("bad string");
    return { key, value: ["string", value] };
  });
}

const SCHEMA: Record<string, AttrType> = {
  xp: "uint32",
  level: "uint32",
  durability: "uint32",
  nickname: "string",
};

/**
 * Unsigned atomicassets::setassetdata body.
 * WAX atomicassets 2.0.0 takes authorized_editor, asset_owner, asset_id, new_mutable_data.
 * The action replaces the stored map with this array. This function does not read the chain and does not broadcast.
 */
export function gainAction(args: {
  authorizedEditor: string;
  assetOwner: string;
  assetId: string;
  previous: MutableMap;
  gain: number;
  types?: Record<string, AttrType>;
}): Action {
  assertName(args.authorizedEditor);
  assertName(args.assetOwner);
  if (!/^[1-9][0-9]{0,19}$/.test(args.assetId)) throw new Error("bad asset id");
  const full = applyGain(args.previous, args.gain);
  return {
    account: "atomicassets",
    name: "setassetdata",
    authorization: [{ actor: args.authorizedEditor, permission: "active" }],
    data: {
      authorized_editor: args.authorizedEditor,
      asset_owner: args.assetOwner,
      asset_id: args.assetId,
      new_mutable_data: toAttributeMap(full, args.types ?? SCHEMA),
    },
  };
}
