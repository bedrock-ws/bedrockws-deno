import { z } from "zod/v4";
import Dimension from "./Dimension.ts";
import Position from "./Position.ts";

export default z.strictObject({
  color: z.string().regex(/[0-9a-f]+/g),
  dimension: Dimension,
  id: z.int().meta({ description: "The numeric ID of the entity" }),
  position: Position.meta({ description: "The position of the entity" }),
  type: z.string().meta({
    description: 'The type of entity (for example `"minecraft:player"`)',
  }),
  variant: z.number(),
  yRot: z.number(),
});
