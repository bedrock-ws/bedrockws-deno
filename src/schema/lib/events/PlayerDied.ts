import { z } from "zod/v4";
import { Player } from "../common/mod.ts";

export default z.strictObject({
  cause: z.union(
    [
      z.literal(-1).meta({ description: "`damage` command" }),
      z.literal(1).meta({
        description: "Killed by block (e.g. Sweet Berries or Cactus)",
      }),
      z.literal(2).meta({ description: "Killed by entity" }),
      z.literal(3).meta({ description: "Projectile" }),
      z.literal(4).meta({ description: "Suffocated" }),
      z.literal(5).meta({ description: "Fall damage, Ender Pearl" }),
      z.literal(6).meta({ description: "Fire" }),
      z.literal(7).meta({ description: "Struck by lightning" }),
      z.literal(8).meta({ description: "Lava" }),
      z.literal(9).meta({ description: "Drowned" }),
      z.literal(11).meta({ description: "Explosion" }),
      z.literal(12).meta({ description: "Fell into void" }),
      z.literal(12).meta({ description: "`kill` command" }),
      z.literal(14).meta({ description: "Potion" }),
      z.literal(18).meta({ description: "Thorns enchantment" }),
      z.literal(22).meta({ description: "Magma block" }),
      z.literal(27).meta({ description: "Frozen" }),
      z.literal(28).meta({ description: "Stalactite" }),
    ] as const,
  ),
  inRaid: z.boolean(),
  killer: z.strictObject({
    color: z.int(),
    id: z.int(),
    type: z.int(),
    variant: z.int(),
  }),
  player: Player,
});
