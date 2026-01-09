import { z } from "zod/v4";
import Dimension from "./common/Dimension.ts";
import Position from "./common/Position.ts";

export const TargetQueryDetails = z.array(z.strictObject({
  dimension: Dimension,
  id: z.int(),
  position: Position,
  uniqueId: z.uuidv4(),
  yRot: z.number(),
}));
