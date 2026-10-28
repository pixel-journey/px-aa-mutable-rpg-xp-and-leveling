import assert from "node:assert/strict";
import test from "node:test";
import type { ChainPrevious } from "../invariants/mutable-xp.ts";
import { gainAction, toAttributeMap } from "./setassetdata-action.ts";

const row = { xp: 50, level: 1, durability: 10, nickname: "oak" };
const previous: ChainPrevious = { source: "chain", map: row };
const editor = "pxrpg";

function action(gain = 50, prev: ChainPrevious = previous) {
  return gainAction({
    caller: editor,
    authorizedEditor: editor,
    assetOwner: "alice",
    assetId: "1099553893624",
    previous: prev,
    gain,
  });
}

test("the action carries the nickname and the four atomicassets fields", () => {
  const built = action();
  assert.equal(built.account, "atomicassets");
  assert.equal(built.name, "setassetdata");
  assert.deepEqual(built.data.new_mutable_data, [
    { key: "durability", value: ["uint32", 9] },
    { key: "level", value: ["uint32", 2] },
    { key: "nickname", value: ["string", "oak"] },
    { key: "xp", value: ["uint32", 100] },
  ]);
  assert.equal(built.data.authorized_editor, editor);
  assert.equal(built.data.asset_owner, "alice");
  assert.equal("signatures" in built, false);
});

test("a caller who is not the editor is refused before an action is built", () => {
  assert.throws(
    () =>
      gainAction({
        caller: "alice",
        authorizedEditor: editor,
        assetOwner: "alice",
        assetId: "1099553893624",
        previous,
        gain: 50,
      }),
    /authorized editor/,
  );
});

test("a previous map that is not marked as coming from the chain is refused", () => {
  assert.throws(
    () => action(50, { source: "caller" as "chain", map: row }),
    /chain/,
  );
});

test("a type map that drops nickname is refused", () => {
  const full = { ...row, xp: 51, durability: 9 };
  assert.throws(
    () => toAttributeMap(full, { xp: "uint32", level: "uint32", durability: "uint32" }),
    /schema keys differ/,
  );
});

test("a chain map that is missing nickname cannot be written", () => {
  const { nickname: _nickname, ...without } = row;
  assert.throws(() => action(1, { source: "chain", map: without }), /schema keys differ/);
});

test("a zero asset id is refused", () => {
  assert.throws(
    () =>
      gainAction({
        caller: editor,
        authorizedEditor: editor,
        assetOwner: "alice",
        assetId: "0",
        previous,
        gain: 1,
      }),
    /bad asset id/,
  );
});
