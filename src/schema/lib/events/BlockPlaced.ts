import { z } from "zod/v4";
import { Block, Item, Player } from "@bedrock-ws/schema/common";

export default z.strictObject({
  block: Block,
  count: z.int().positive(),
  placedUnderwater: z.boolean(),
  placementMethod: z.int().nonnegative(), // TODO: enum; hand, command, ...
  player: Player,
  tool: Item,
}).meta({
  description: "This event only emits when the connected client triggers it",
});
