import * as z from "zod/v4";
import { EventName } from "./shared.ts";

export const Player = z.strictObject({
  color: z.string().regex(/[0-9a-f]+/g),
  dimension: z.number(),
  id: z.number(),
  name: z.string(),
  position: z.strictObject({
    x: z.number(), y: z.number(), z: z.number(),
  }),
  type: z.string().meta({description: "This is always `\"minecraft:player\"`"}),
  variant: z.number(),
  yRot: z.number(),
})

export const PlayerTravelled = z.strictObject({
  isUnderwater: z.boolean(),
  metersTravelled: z.number(),
  newBiome: z.number(),
  player: Player,
  travelMethod: z.number(),
})

export const EventResponse = z.strictObject({
  header: z.strictObject({
    eventName: EventName,
    messagePurpose: z.literal("event"),
    version: z.number().meta({
      description:
        "Number representing the compability version. This is always 17104896 as of writing and represents Minecraft version 1.5.0",
    }),
  }),
  body: z.any(), // TODO
});

export const Response = z.union([EventResponse] as const);
