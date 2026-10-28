import assert from "node:assert/strict";
import test from "node:test";
import { applyGain, expectedLevel, mergeMutable, wipedMap } from "./mutable-xp.ts";

const row = { xp: 50, level: 1, durability: 10, nickname: "oak" };
const editor = "collection.author";

test("authorized editor: 50 plus 50 keeps the nickname and reaches level 2", () => {
  assert.deepEqual(applyGain(editor, editor, row, 50), {
    xp: 100,
    level: 2,
    durability: 9,
    nickname: "oak",
  });
});

test("unauthorized caller is refused", () => {
  assert.throws(() => applyGain("alice", editor, row, 50), /authorized editor/);
});

test("level is 1 plus xp divided by 100", () => {
  assert.equal(expectedLevel(0), 1);
  assert.equal(expectedLevel(99), 1);
  assert.equal(expectedLevel(100), 2);
});

test("a broken item is refused and the row is not a partial map", () => {
  assert.throws(() => applyGain(editor, editor, { ...row, durability: 0 }, 1), /broken/);
});

test("a level that does not match xp is refused", () => {
  assert.throws(() => applyGain(editor, editor, { ...row, level: 4 }, 1), /level mismatch/);
});

test("gain above 10000 is refused", () => {
  assert.throws(() => applyGain(editor, editor, row, 10001), /bad gain/);
  assert.throws(() => applyGain(editor, editor, row, 0), /bad gain/);
});

test("uint32 xp is refused at the cap", () => {
  const near = { xp: 0xffffffff - 5, level: expectedLevel(0xffffffff - 5), durability: 3, nickname: "oak" };
  assert.throws(() => applyGain(editor, editor, near, 6), /xp cap/);
});

test("a partial map drops the nickname", () => {
  const wiped = wipedMap({ xp: 51, level: 1, durability: 9 });
  assert.equal("nickname" in wiped, false);
  assert.equal(mergeMutable(row, { xp: 51 }).nickname, "oak");
});

test("a new key is refused", () => {
  assert.throws(() => mergeMutable(row, { title: "nope" }), /new key/);
});
