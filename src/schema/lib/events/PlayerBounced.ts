import { z } from "zod/v4";
import { Item, Player } from "../common/mod.ts";

export default z.strictObject({
  block: Item,
  bounceHeight: z.number(),
  player: Player,
});
