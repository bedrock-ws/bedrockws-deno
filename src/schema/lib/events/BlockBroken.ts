import { z } from "zod/v4";
import { Player } from "../common.ts";

export default z.strictObject({
  block: z.strictObject({
    aux: z.int(), // TODO: seems to be always 0 perhaps because MC removed aux values
    id: z.string().nonempty().meta({description: 'The ID of the block (for example `"magma"`)'}),
    namespace: z.string().nonempty().meta({description: 'The namespace of the block (for example `"minecraft"`)'})
  }),
  count: z.int().nonnegative().meta({description: "The amount of block that have been destroyed"}),
  destructionMethod: z.int().nonnegative(), // TODO: enum; hand, explosion, tool, ...
  player: Player,
  tool: z.strictObject({
    // TODO: extend Item/Block
    aux: z.int(), // TODO: see above
    enchantments: z.array(z.unknown()), // TODO: inner type
    freeStackSize: z.int(), // TODO: don't know what this is
    id: z.string().meta({description: "The ID of the tool that has been used"}),
    maxStackSize: z.int().nonnegative().meta({description: "The maximum stack size of the tool"}),
    namespace: z.string().nonempty().meta({description: 'The namespace of the tool (for example `"minecraft"`)'}),
    stackSize: z.int().nonnegative(),
  }),
  variant: z.number(), // TODO: don't know what this is
});
