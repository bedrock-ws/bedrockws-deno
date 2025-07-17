import * as z from "zod/v4";

export const CompatibilityVersion = z.number().meta({
  description:
    "Number representing the compatibility version. This is always 17104896 as of writing and represents Minecraft version 1.5.0",
});

export const Player = z.strictObject({
  color: z.string().regex(/[0-9a-f]+/g),
  dimension: z.union(
    [
      z.literal(0).meta({ description: "Overworld" }),
      z.literal(1).meta({ description: "Nether" }),
      z.literal(2).meta({ description: "End dimension" }),
    ] as const,
  ),
  id: z.number(),
  name: z.string(),
  position: z.strictObject({
    x: z.number(),
    y: z.number(),
    z: z.number(),
  }).meta({ description: "The position of the player" }),
  type: z.string().meta({ description: 'This is always `"minecraft:player"`' }),
  variant: z.number(),
  yRot: z.number(),
});

