import { z } from "zod/v4";
import { Item, Player } from "@bedrock-ws/schema/common";

export default z.strictObject({
  block: Item,
  bounceHeight: z.number(),
  player: Player,
});
