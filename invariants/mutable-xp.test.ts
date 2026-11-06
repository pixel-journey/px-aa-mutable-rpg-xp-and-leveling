import assert from "node:assert/strict";
import test from "node:test";
import { applyGain, expectedLevel, mergeMutable, requireUint32, wipedMap, XP_GAIN_MAX } from "./mutable-xp.ts";

const row = { xp: 50, level: 1, durability: 10, nickname: "oak" };
const editor = "collection.author";
const chain = (map: typeof row) => ({ source: "chain" as const, map });

test("authorized editor: 50 plus 50 keeps the nickname and reaches level 2", () => {
  assert.deepEqual(applyGain(editor, editor, chain(row), 50), {
    xp: 100,
    level: 2,
    durability: 9,
    nickname: "oak",
  });
});

test("each gain subtracts exactly one durability", () => {
  const once = applyGain(editor, editor, chain(row), 1);
  assert.equal(once.durability, 9);
  const twice = applyGain(editor, editor, chain({ ...row, durability: 9, xp: 51, level: 1 }), 1);
  assert.equal(twice.durability, 8);
});

test("unauthorized caller is refused", () => {
  assert.throws(() => applyGain("alice", editor, chain(row), 50), /authorized editor/);
});

test("previous that did not come from the chain is refused", () => {
  assert.throws(
    () => applyGain(editor, editor, { source: "caller" as any, map: row }, 50),
    /chain/
  );
});

test("level is 1 plus xp divided by 100", () => {
  assert.equal(expectedLevel(0), 1);
  assert.equal(expectedLevel(99), 1);
  assert.equal(expectedLevel(100), 2);
});

test("a broken item is refused and the row is not a partial map", () => {
  assert.throws(() => applyGain(editor, editor, chain({ ...row, durability: 0 }), 1), /broken/);
});

test("a level that does not match xp is refused", () => {
  assert.throws(() => applyGain(editor, editor, chain({ ...row, level: 4 }), 1), /level mismatch/);
});

test("gain above 10000 is refused", () => {
  assert.throws(() => applyGain(editor, editor, chain(row), 10001), /bad gain/);
  assert.throws(() => applyGain(editor, editor, chain(row), 0), /bad gain/);
});

test("max gain 10000 is accepted", () => {
  const next = applyGain(editor, editor, chain(row), XP_GAIN_MAX);
  assert.equal(next.xp, 50 + XP_GAIN_MAX);
  assert.equal(next.level, expectedLevel(50 + XP_GAIN_MAX));
});

test("negative gain is refused", () => {
  assert.throws(() => applyGain(editor, editor, chain(row), -1), /bad gain/);
});

test("non-integer gain is refused", () => {
  assert.throws(() => applyGain(editor, editor, chain(row), 1.5), /bad gain/);
});

test("a string stored where a uint32 is required is refused", () => {
  assert.throws(() => requireUint32("50", "xp"), /bad xp/);
  assert.throws(
    () => applyGain(editor, editor, chain({ ...row, xp: "50" as unknown as number }), 1),
    /bad xp/
  );
});

test("uint32 xp is refused at the cap", () => {
  const near = { xp: 0xffffffff - 5, level: expectedLevel(0xffffffff - 5), durability: 3, nickname: "oak" };
  assert.throws(() => applyGain(editor, editor, chain(near), 6), /xp cap/);
});

test("a partial map drops the nickname", () => {
  const wiped = wipedMap({ xp: 51, level: 1, durability: 9 });
  assert.equal("nickname" in wiped, false);
  assert.equal(mergeMutable(row, { xp: 51 }).nickname, "oak");
});

test("empty merge is a full copy", () => {
  assert.deepEqual(mergeMutable(row, {}), row);
});

test("a new key is refused", () => {
  assert.throws(() => mergeMutable(row, { title: "nope" }), /new key/);
});
