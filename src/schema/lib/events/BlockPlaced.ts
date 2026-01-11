import { z } from "zod/v4";
import { DetailedItem, Item, Player } from "../common/mod.ts";

export default z.strictObject({
  block: Item,
  count: z.int().positive(),
  placedUnderwater: z.boolean(),
  placementMethod: z.union(
    [
      z.literal(0).meta({ description: "The block was placed by hand" }),
    ] as const,
  ).meta({ description: "The method used to place the block" }),
  player: Player,
  tool: DetailedItem,
}).meta({
  description: "This event only emits when the connected client triggers it",
});
