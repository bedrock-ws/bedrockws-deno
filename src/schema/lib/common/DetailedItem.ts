import { z } from "zod/v4";
import Aux from "./Aux.ts";

export default z.strictObject({
  // TODO: extend Block?
  aux: Aux,
  enchantments: z.array(z.unknown()), // TODO: inner type
  freeStackSize: z.int(), // TODO: don't know what this is
  id: z.string().meta({ description: "The ID of the tool that has been used" }),
  maxStackSize: z.int().nonnegative().meta({
    description: "The maximum stack size of the tool",
  }),
  namespace: z.string().nonempty().meta({
    description: 'The namespace of the tool (for example `"minecraft"`)',
  }),
  stackSize: z.int().nonnegative(),
});
