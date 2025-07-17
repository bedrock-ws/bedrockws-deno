import { z } from "zod/v4";

export default z.strictObject({
  message: z.string().meta({ description: "The message that got sent." }),
  sender: z.string().meta({
    description: "The player name of the sender of the message.",
  }),
  receiver: z.string().meta({
    description:
      "The receiver of the message or an empty string if there is no particular receiver. This is usually the player name targeted when using the `tell`/`w`/`msg` or `tellraw` command.",
  }),
  type: z.union([
    z.literal("tell").meta({
      description: "The `tell`/`w`/`msg` command has been used.",
    }),
    z.literal("say").meta({ description: "The `say` command has been used." }),
    z.literal("chat").meta({
      description: "The chat (no command) has been used.",
    }),
  ]),
});
