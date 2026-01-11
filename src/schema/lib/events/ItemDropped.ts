import { z } from "zod/v4";
import { Item, Player } from "../common/mod.ts";

export default z.strictObject({
  count: z.int().nonnegative(),
  item: Item,
  player: Player,
});
