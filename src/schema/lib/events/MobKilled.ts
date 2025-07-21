import { z } from "zod/v4";
import { Item, Player, Entity } from "@bedrock-ws/schema/common";

export default z.strictObject({
  armorBody: Item,
  armorFeet: Item,
  armorHead: Item,
  armorTorso: Item,
  isMonster: z.boolean(),
  killMethodType: z.number(),
  player: Player,
  playerIsHiddenFrom: z.boolean(),
  victim: Entity,
  weapon: Item,
});
