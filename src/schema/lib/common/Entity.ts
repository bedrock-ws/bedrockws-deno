import { z } from "zod/v4";

export default z.strictObject({
  color: z.string().regex(/[0-9a-f]+/g),
  dimension: z.union(
    [
      z.literal(0).meta({ description: "Overworld" }),
      z.literal(1).meta({ description: "Nether" }),
      z.literal(2).meta({ description: "End dimension" }),
    ] as const,
  ),
  id: z.int().meta({ description: "The numeric ID of the entity" }),
  position: z.strictObject({
    x: z.number(),
    y: z.number(),
    z: z.number(),
  }).meta({ description: "The position of the entity" }),
  type: z.string().meta({
    description: 'The type of entity (for example `"minecraft:player"`)',
  }),
  variant: z.number(),
  yRot: z.number(),
});
