import assert from "node:assert/strict";
import test from "node:test";
import { gainAction, toAttributeMap } from "./setassetdata-action.ts";

const previous = { xp: 50, level: 1, durability: 10, nickname: "oak" };

test("the action carries the nickname and the four atomicassets fields", () => {
  const action = gainAction({
    authorizedEditor: "pxrpg",
    assetOwner: "alice",
    assetId: "1099553893624",
    previous,
    gain: 50,
  });
  assert.equal(action.account, "atomicassets");
  assert.equal(action.name, "setassetdata");
  assert.deepEqual(action.data.new_mutable_data, [
    { key: "durability", value: ["uint32", 9] },
    { key: "level", value: ["uint32", 2] },
    { key: "nickname", value: ["string", "oak"] },
    { key: "xp", value: ["uint32", 100] },
  ]);
  assert.equal(action.data.authorized_editor, "pxrpg");
  assert.equal(action.data.asset_owner, "alice");
  assert.equal("signatures" in action, false);
});

test("a type map that drops nickname is refused", () => {
  const full = { ...previous, xp: 51, durability: 9 };
  assert.throws(
    () => toAttributeMap(full, { xp: "uint32", level: "uint32", durability: "uint32" }),
    /schema keys differ/,
  );
});
