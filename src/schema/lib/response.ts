import * as z from "zod/v4";
import { CompatibilityVersion } from "./common.ts";
import PlayerTravelled from "./events/PlayerTravelled.ts";
import PlayerMessage from "./events/PlayerMessage.ts";

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

function commandResponse(
  body,
) {
  return z.strictObject({
    header: z.strictObject({
      messagePurpose: z.literal("commandResponse"),
      requestId: z.uuidv4(),
      version: CompatibilityVersion,
    }),
    body: z.strictObject({
      statusCode: z.number().meta({
        description:
          "The status code of an executed command. This is negative on failure and zero on success.",
      }),
      statusMessage: z.string().meta({
        description: "The command output displayed in the chat.",
      }),
    }).extend(body),
  });
}

export const EventResponse = z.union(
  [
    eventResponse("PlayerMessage", PlayerMessage),
    eventResponse("PlayerTravelled", PlayerTravelled),
  ] as const,
);

export const CommandResponse = z.union(
  [
    commandResponse({
      message: z.string().meta({ description: "The message that got send" }),
      recipient: z.array(z.string()).meta({
        description: "Names of players who received the message",
      }),
    }), // tell/w/msg command
    commandResponse({ details: z.string() }), // getlocalplayername command
    commandResponse({}), // errors
  ] as const,
);

export const Response = z.union([EventResponse] as const);
