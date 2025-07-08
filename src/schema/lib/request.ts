import * as z from "zod/v4";

export const MessageType = z.enum(["commandRequest"] as const);

export const MessagePurpose = z.enum(
  ["subscribe", "unsubscribe", "commandRequest"] as const,
);

export const Request = z.strictObject({
  header: z.strictObject({
    version: z.number(),
    messageType: MessageType,
    messagePurpose: MessagePurpose,
    requestId: z.uuidv4(),
  }),
  body: z.any(), // TODO
});
