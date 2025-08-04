import { z } from "zod/v4";
import { DetailedItem, Item, Player } from "@bedrock-ws/schema/common";

export default z.strictObject({
  block: Item,
  count: z.int().positive(),
  placedUnderwater: z.boolean(),
  placementMethod: z.int().nonnegative(), // TODO: enum; hand, command, ...
  player: Player,
  tool: DetailedItem,
}).meta({
  description: "This event only emits when the connected client triggers it",
});
