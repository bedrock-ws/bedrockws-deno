import { z } from "zod/v4";
import { Player } from "@bedrock-ws/schema/common";

export default z.strictObject({
  player: Player,
});
