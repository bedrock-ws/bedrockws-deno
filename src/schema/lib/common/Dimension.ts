import { z } from "zod/v4";

export default z.union(
  [
    z.literal(0).meta({ description: "Overworld" }),
    z.literal(1).meta({ description: "Nether" }),
    z.literal(2).meta({ description: "End dimension" }),
  ] as const,
);
