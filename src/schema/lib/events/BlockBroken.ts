import { z } from "zod/v4";
import { Block, Item, Player } from "@bedrock-ws/schema/common";

export default z.strictObject({
  block: Block,
  count: z.int().nonnegative().meta({
    description: "The amount of block that have been destroyed",
  }),
  destructionMethod: z.int().nonnegative(), // TODO: enum; hand, explosion, tool, ...
  player: Player,
  tool: Item,
}).meta({
  description: "This event only emits when the connected client triggers it",
});
