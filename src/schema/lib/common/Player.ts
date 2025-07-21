import { z } from "zod/v4";
import Entity from "./Entity.ts";

export default Entity.extend({
  name: z.string().meta({ description: "The name of the player" }),
});
