import { z } from "zod/v4";

export default z.strictObject({
  cause: z.union(
    [
      z.literal(1).meta({ description: "Ender Pearl" }),
      z.literal(2).meta({ description: "Chorus Fruit" }),
      z.literal(3).meta({ description: "Teleport command" }),
    ] as const,
  ).meta({ description: "The method used for teleporting" }),
  itemType: z.int().meta({
    description:
      "The item type used for the teleportation. This seems to always be 1 unless using a chorus fruit, then it's 87",
  }),
  metersTravelled: z.number(),
});
