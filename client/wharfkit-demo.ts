import { Session } from "@wharfkit/session";

const CONTRACT = "replaceaccount";

export async function questComplete(
  session: Session,
  assetId: string,
  xpGained: number,
  durabilityCost: number,
) {
  return session.transact({
    actions: [
      {
        account: CONTRACT,
        name: "questcomplete",
        authorization: [session.permissionLevel],
        data: {
          asset_owner: session.actor,
          asset_id: assetId,
          xp_gained: xpGained,
          durability_cost: durabilityCost,
        },
      },
    ],
  });
}
