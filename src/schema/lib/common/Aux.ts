import { z } from "zod/v4";

export default z.int().meta({ description: "The aux value (always `0`)" });
