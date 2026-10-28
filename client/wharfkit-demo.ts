import { gainAction } from "./setassetdata-action.ts";
import type { ChainPrevious } from "../invariants/mutable-xp.ts";

/**
 * Unsigned educational builder. Does not import a session library and does not broadcast.
 * Do not set previous.source to "chain" in this file. The caller must pass a previous
 * map that was actually read from the asset row. Stamping the marker here would hide a forgery.
 * There is no durability_cost argument. The tested rule always subtracts 1.
 */
export function unsignedGainAction(args: {
  caller: string;
  authorizedEditor: string;
  assetOwner: string;
  assetId: string;
  previous: ChainPrevious;
  gain: number;
}) {
  return gainAction(args);
}
