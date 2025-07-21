import { z } from "zod/v4";
import { Aux } from "@bedrock-ws/schema/common";

export default z.strictObject({
  aux: Aux,
  id: z.string().nonempty().meta({
    description: 'The ID of the block (for example `"magma"`)',
  }),
  namespace: z.string().nonempty().meta({
    description: 'The namespace of the block (for example `"minecraft"`)',
  }),
});
