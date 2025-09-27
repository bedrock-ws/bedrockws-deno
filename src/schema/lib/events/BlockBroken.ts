import { z } from "zod/v4";
import { DetailedItem, Item, Player } from "@bedrock-ws/schema/common";

export default z.strictObject({
  block: Item,
  count: z.int().nonnegative().meta({
    description: "The amount of block that have been destroyed",
  }),
  destructionMethod: z.union([
    // It seems as this is the only method. Methods like explosions are not
    // tracked. Not even destroying farm land by jumping on it counts.
    z.literal(0).meta({description: "Destroyed by hand"}),
  ] as const),
  player: Player,
  tool: DetailedItem,
}).meta({
  description: "This event only emits when the connected client triggers it",
});
