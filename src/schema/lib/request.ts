import * as z from "zod/v4";
import { EventName } from "./common.ts";

export const UnsubscribeRequest = z.strictObject({
  header: z.strictObject({
    messageType: z.literal("commandRequest"),
    messagePurpose: z.literal("unsubscribe"),
  }),
  body: z.strictObject({
    eventName: EventName,
  }),
});

export const SubscribeRequest = z.strictObject({
  header: z.strictObject({
    messageType: z.literal("commandRequest"),
    messagePurpose: z.literal("subscribe"),
  }),
  body: z.strictObject({
    eventName: EventName,
  }),
});

export const CommandRequest = z.strictObject({
  header: z.strictObject({
    messageType: z.literal("commandRequest"),
    messagePurpose: z.literal("commandRequest"),
  }),
  body: z.strictObject({
    version: z.literal(1).meta({ description: "Protocol version" }),
    commandLine: z.string().nonempty().meta({
      description: "The Minecraft command to request (without slash prefix)",
    }),
    origin: z.strictObject({
      type: z.literal("player"),
    }).optional(),
  }),
});

export const Request = z.union([
  SubscribeRequest,
  UnsubscribeRequest,
  CommandRequest,
]);
