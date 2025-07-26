import { z } from "zod/v4";
import { Item, Player } from "@bedrock-ws/schema/common";

export default z.strictObject({
  count: z.int().nonnegative(),
  item: Item,
  player: Player,
});
