/**
 * Composition: multi-gain RPG lifecycle.
 * Sequential gains preserve nickname; levels track XP; durability drains to broken.
 * A partial write (wipe) loses sibling keys — merge does not.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  applyGain,
  expectedLevel,
  mergeMutable,
  wipedMap,
  type MutableMap,
} from "./mutable-xp.ts";

const EDITOR = "collection.author";
const chain = (map: MutableMap) => ({ source: "chain" as const, map });

describe("composition: multi-gain RPG lifecycle", () => {
  it("three sequential gains keep nickname and level tracks xp", () => {
    let map: MutableMap = { xp: 0, level: 1, durability: 5, nickname: "oak" };
    map = applyGain(EDITOR, EDITOR, chain(map), 40);
    assert.equal(map.xp, 40);
    assert.equal(map.level, 1);
    assert.equal(map.nickname, "oak");
    assert.equal(map.durability, 4);

    map = applyGain(EDITOR, EDITOR, chain(map), 60);
    assert.equal(map.xp, 100);
    assert.equal(map.level, 2);
    assert.equal(map.nickname, "oak");
    assert.equal(map.durability, 3);

    map = applyGain(EDITOR, EDITOR, chain(map), 50);
    assert.equal(map.xp, 150);
    assert.equal(map.level, expectedLevel(150));
    assert.equal(map.nickname, "oak");
    assert.equal(map.durability, 2);
  });

  it("durability drains to broken; next gain refused", () => {
    let map: MutableMap = { xp: 10, level: 1, durability: 2, nickname: "pine" };
    map = applyGain(EDITOR, EDITOR, chain(map), 1);
    assert.equal(map.durability, 1);
    map = applyGain(EDITOR, EDITOR, chain(map), 1);
    assert.equal(map.durability, 0);
    assert.throws(
      () => applyGain(EDITOR, EDITOR, chain(map), 1),
      /broken/,
    );
    assert.equal(map.nickname, "pine");
  });

  it("partial wipe drops nickname; merge keeps it across gains", () => {
    const start: MutableMap = { xp: 50, level: 1, durability: 10, nickname: "oak" };
    const partial = wipedMap({ xp: 100, level: 2, durability: 9 });
    assert.equal("nickname" in partial, false);

    const full = applyGain(EDITOR, EDITOR, chain(start), 50);
    assert.equal(full.nickname, "oak");
    assert.deepEqual(
      mergeMutable(start, { xp: 100, level: 2, durability: 9 }),
      full,
    );
  });

  it("failed mid-path leaves prior map usable for retry", () => {
    const map: MutableMap = { xp: 50, level: 1, durability: 3, nickname: "oak" };
    assert.throws(
      () => applyGain("alice", EDITOR, chain(map), 10),
      /authorized editor/,
    );
    const next = applyGain(EDITOR, EDITOR, chain(map), 10);
    assert.equal(next.xp, 60);
    assert.equal(next.nickname, "oak");
    assert.equal(next.durability, 2);
  });
});
