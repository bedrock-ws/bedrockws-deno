import { z } from "zod/v4";

export default z.strictObject({
  cause: z.union(
    [
      z.literal(1).meta({ description: "Ender Pearl" }),
      z.literal(2).meta({ description: "Chorus Fruit" }),
      z.literal(3).meta({ description: "Teleport command" }),
    ] as const,
  ).meta({ description: "The method used for teleporting" }),
  itemType: z.int().optional(), // TODO
  metersTravelled: z.number(),
});
