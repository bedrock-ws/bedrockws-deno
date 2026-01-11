import { z } from "zod/v4";
import { Player } from "../common/mod.ts";

export default z.strictObject({
  isUnderwater: z.boolean(),
  metersTravelled: z.number(),
  newBiome: z.number(),
  player: Player,
  travelMethod: z.union(
    [
      z.literal(0).meta({ description: "Walking" }),
      z.literal(1).meta({ description: "Swimming" }),
      z.literal(2).meta({ description: "Falling / Flying (Elytra)" }),
      z.literal(5).meta({ description: "Flying (in creative mode)" }),
      z.literal(6).meta({ description: "Riding (minecart for example)" }),
    ] as const,
  ),
});
