export const XP_PER_LEVEL = 100;
export const XP_GAIN_MAX = 10000;
export const UINT32_MAX = 0xffffffff;

export type MutableMap = Record<string, string | number>;

function uint32(value: string | number, label: string): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0 || value > UINT32_MAX) {
    throw new Error("bad " + label);
  }
  return value;
}

export function expectedLevel(xp: number): number {
  return 1 + Math.floor(xp / XP_PER_LEVEL);
}

/**
 * Copy every key, then overlay updates. A key that was not already present is refused.
 * An empty update is a copy, not an empty map.
 */
export function mergeMutable(previous: MutableMap, updates: MutableMap): MutableMap {
  const next: MutableMap = { ...previous };
  for (const key of Object.keys(updates)) {
    if (!Object.prototype.hasOwnProperty.call(previous, key)) throw new Error("new key");
    next[key] = updates[key];
  }
  return next;
}

/** The map a partial setassetdata would send. Nickname and any other omitted key are gone. */
export function wipedMap(updates: MutableMap): MutableMap {
  return { ...updates };
}

export function applyGain(
  caller: string,
  authorizedEditor: string,
  previous: MutableMap,
  gain: number
): MutableMap {
  if (caller !== authorizedEditor) throw new Error("not authorized editor");
  if (!Number.isInteger(gain) || gain < 1 || gain > XP_GAIN_MAX) throw new Error("bad gain");
  const xp = uint32(previous.xp, "xp");
  const level = uint32(previous.level, "level");
  const durability = uint32(previous.durability, "durability");
  if (level !== expectedLevel(xp)) throw new Error("level mismatch");
  if (durability < 1) throw new Error("broken");
  if (xp > UINT32_MAX - gain) throw new Error("xp cap");
  const nextXp = xp + gain;
  return mergeMutable(previous, {
    xp: nextXp,
    level: expectedLevel(nextXp),
    durability: durability - 1,
  });
}
