import { z } from "zod/v4";
import { Player, Item, Block } from "@bedrock-ws/schema/common";

export default z.strictObject({
  block: Block,
  count: z.int().nonnegative().meta({
    description: "The amount of block that have been destroyed",
  }),
  destructionMethod: z.int().nonnegative(), // TODO: enum; hand, explosion, tool, ...
  player: Player,
  tool: Item,
});
