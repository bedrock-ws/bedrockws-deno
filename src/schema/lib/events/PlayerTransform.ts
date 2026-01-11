import { z } from "zod/v4";
import { Player } from "../common/mod.ts";

export default z.strictObject({
  player: Player,
});
