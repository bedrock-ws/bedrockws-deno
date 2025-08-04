import { z } from "zod/v4";
import { DetailedItem, Entity, Player } from "@bedrock-ws/schema/common";

export default z.strictObject({
  armorBody: DetailedItem,
  armorFeet: DetailedItem,
  armorHead: DetailedItem,
  armorTorso: DetailedItem,
  isMonster: z.boolean(),
  killMethodType: z.number(),
  player: Player,
  playerIsHiddenFrom: z.boolean(),
  victim: Entity,
  weapon: DetailedItem,
});
