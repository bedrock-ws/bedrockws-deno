import * as z from "zod/v4";
import { CompatibilityVersion } from "./common.ts";

export const Player = z.strictObject({
  color: z.string().regex(/[0-9a-f]+/g),
  dimension: z.union([
    z.literal(0).meta({ description: "Overworld" }),
    z.literal(1).meta({ description: "Nether" }),
    z.literal(2).meta({ description: "End dimension" }),
  ] as const),
  id: z.number(),
  name: z.string(),
  position: z.strictObject({
    x: z.number(),
    y: z.number(),
    z: z.number(),
  }).meta({ description: "The position of the player" }),
  type: z.string().meta({ description: 'This is always `"minecraft:player"`' }),
  variant: z.number(),
  yRot: z.number(),
});

export const PlayerTravelled = z.strictObject({
  isUnderwater: z.boolean(),
  metersTravelled: z.number(),
  newBiome: z.number(),
  player: Player,
  travelMethod: z.union([
    // TODO: Elytra, swimming, jumping
    z.literal(0).meta({ description: "Walking" }),
    z.literal(2).meta({ description: "Falling" }),
    z.literal(5).meta({ description: "Flying (in creative mode)" }),
    z.literal(6).meta({ description: "Riding (minecart for example)" }),
  ] as const),
});

function eventResponse<ItemType extends z.ZodType>(
  eventName: string,
  body: ItemType,
) {
  return z.strictObject({
    header: z.strictObject({
      messagePurpose: z.literal("event"),
      version: CompatibilityVersion,
      eventName: z.literal(eventName),
    }),
    body,
  });
}

export const EventResponse = z.union([
  eventResponse("PlayerTravelled", PlayerTravelled),
] as const);

export const Response = z.union([EventResponse] as const);
