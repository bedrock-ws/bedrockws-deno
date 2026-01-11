import { z } from "zod/v4";
import { Aux, Player } from "../common/mod.ts";

export default z.strictObject({
  count: z.int(),
  item: z.strictObject({
    aux: Aux,
    id: z.string(),
    namespace: z.string(),
  }),
  player: Player,
  useMethod: z.union(
    [
      // TODO
      z.literal(1).meta({ description: "Eating" }),
      z.literal(10).meta({ description: "Setting on fire" }),
    ] as const,
  ).meta({ description: "The method used to interact with the item" }),
});
