import { Bot, stringParamType } from "@bedrock-ws/bot";
import * as ui from "@bedrock-ws/ui";
import type { Command, CommandArgument, CommandOrigin } from "@bedrock-ws/bot";

const bot = new Bot({ commandPrefix: "." });

const markupCommand: Command = {
  name: "markup",
  aliases: ["mu"],
  description: "Send a message with markup capabilities",
  mandatoryParameters: [
    { name: "message", type: stringParamType },
  ],
  examples: [{
    description: "Send a colored message",
    args: ["<materialGold>Welcome!</materialGold>"],
  }],
};

bot.cmd(markupCommand, (origin: CommandOrigin, ...args: CommandArgument[]) => {
  const { client } = origin;
  const message = args.shift() as string;
  const rendered = ui.render(message);
  client.sendMessage(rendered);
});

bot.launch({
  hostname: Deno.env.get("BEDROCKWS_DENO_HOST")!,
  port: parseInt(Deno.env.get("BEDROCKWS_DENO_PORT")!),
});
