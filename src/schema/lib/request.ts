import * as z from "zod/v4";
import { EventName } from "./common.ts";

export const UnsubscribeRequest = z.strictObject({
  header: z.strictObject({
    version: z.literal(1).meta({ description: "Protocol version" }),
    requestId: z.uuidv4(),
    messageType: z.literal("commandRequest"),
    messagePurpose: z.literal("unsubscribe"),
  }),
  body: z.strictObject({
    eventName: EventName,
  }),
});

export const SubscribeRequest = z.strictObject({
  header: z.strictObject({
    version: z.literal(1).meta({ description: "Protocol version" }),
    requestId: z.uuidv4(),
    messageType: z.literal("commandRequest"),
    messagePurpose: z.literal("subscribe"),
  }),
  body: z.strictObject({
    eventName: EventName,
  }),
});

// TODO: duplicate code fragments

export const EncryptionMode = z.union([
  z.literal("cfb8").describe("AES256 CFB-8"),
  z.literal("cfb").describe("AES256 CFB"),
]);

export const EncryptionRequest = z.strictObject({
  header: z.strictObject({
    version: z.literal(1).meta({ description: "Protocol version" }),
    requestId: z.uuidv4(),
    messagePurpose: z.literal("ws:encrypt"),
  }),
  body: z.strictObject({
    mode: EncryptionMode,
    publicKey: z.string(),
    salt: z.string(),
  })
});

export const CommandRequest = z.strictObject({
  header: z.strictObject({
    version: z.literal(1).meta({ description: "Protocol version" }),
    requestId: z.uuidv4(),
    messageType: z.literal("commandRequest"),
    messagePurpose: z.literal("commandRequest"),
  }),
  body: z.strictObject({
    version: z.string().nonempty().optional().meta({
      description: "Minecraft version of the command syntax",
    }),
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
  EncryptionRequest,
  CommandRequest,
]);
