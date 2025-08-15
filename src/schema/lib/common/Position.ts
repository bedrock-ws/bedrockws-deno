import { z } from "zod/v4";

export default z.strictObject({
  x: z.number(),
  y: z.number(),
  z: z.number(),
});
