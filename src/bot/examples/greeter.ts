import { Bot, stringParamType } from "@bedrock-ws/bot";
import type { Command, CommandArgument, CommandOrigin } from "@bedrock-ws/bot";

const bot = new Bot({ commandPrefix: "." });

const greetCommand: Command = {
  name: "greet",
  aliases: ["sayhello", "welcome"],
  description: "Greets a player",
  optionalParameters: [
    { type: stringParamType, name: "target" },
  ],
  examples: [{
    description: "Greet a player named Steve",
    args: ["Steve"],
  }],
};

bot.cmd(greetCommand, (origin: CommandOrigin, ...args: CommandArgument[]) => {
  const { initiator, client } = origin;
  console.debug(args);
  const target = args.shift() as string | undefined;
  const player = target ?? "everyone";
  client.sendMessage(`${initiator} greets ${player}!`);
});

bot.launch({
  hostname: Deno.env.get("BEDROCKWS_DENO_HOST")!,
  port: parseInt(Deno.env.get("BEDROCKWS_DENO_PORT")!),
});
