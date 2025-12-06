/**
 * A bot designed to test out things in the the communication between the server
 * and the client.
 */

import {
  Bot,
  type CommandArgument,
  type CommandOrigin,
  integerParamType,
} from "@bedrock-ws/bot";

const bot = new Bot({ commandPrefix: "." });

// The maximum message length seems to be around 456 characters. Exceeding this
// limit may lead to a game crash. Sending too many messages to quick may as
// well lead to a game crash.
bot.cmd({
  name: "test_message_max_length",
  description: "Tests the maximum message length that can be sent",
  optionalParameters: [
    {
      type: integerParamType,
      name: "start_length",
      description: "The initial length",
      default: { value: 450 },
    },
  ],
}, async (origin: CommandOrigin, ...args: CommandArgument[]) => {
  const { client } = origin;
  const startLength = args.shift() as number;

  const char = "A";
  let message = char.repeat(startLength);
  while (true) {
    try {
      await client.sendMessage(message, { split: false });
    } catch (reason) {
      console.info(`Failed to send message of length ${message.length}`, {
        reason,
      });
      break;
    }
    console.log(`Successfully sent message of length ${message.length}`);
    message += char;
  }
});

bot.launch({
  hostname: Deno.env.get("BEDROCKWS_DENO_HOST")!,
  port: parseInt(Deno.env.get("BEDROCKWS_DENO_PORT")!),
});
