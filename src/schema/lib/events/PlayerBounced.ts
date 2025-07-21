import { z } from "zod/v4";
import { Block, Player } from "@bedrock-ws/schema/common";

export default z.strictObject({
  block: Block,
  bounceHeight: z.number(),
  player: Player,
});
