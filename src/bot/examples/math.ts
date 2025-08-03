import { Bot, CommandParamType } from "@bedrock-ws/bot";
import type { Command, CommandArgument, CommandOrigin } from "@bedrock-ws/bot";

const bot = new Bot({ commandPrefix: "." });

const sinCommand: Command = {
  name: "sin",
  description: "Calculates the sine",
  mandatoryParameters: [
    { type: CommandParamType.Float, name: "number" },
  ],
  examples: [{
    description: "Calculate the sine of 1",
    args: ["1"],
  }],
};

bot.cmd(sinCommand, (origin: CommandOrigin, ...args: CommandArgument[]) => {
  const { client } = origin;
  const n = args.shift() as number;
  client.sendMessage(`sin(${n}) = ${Math.sin(n)}`);
});

const cosCommand: Command = {
  name: "cos",
  description: "Calculates the cosine",
  mandatoryParameters: [
    { type: CommandParamType.Float, name: "number" },
  ],
  examples: [{
    description: "Calculate the cosine of 1",
    args: ["1"],
  }],
};

bot.cmd(cosCommand, (origin: CommandOrigin, ...args: CommandArgument[]) => {
  const { client } = origin;
  const n = args.shift() as number;
  client.sendMessage(`cos(${n}) = ${Math.cos(n)}`);
});

bot.launch({
  hostname: Deno.env.get("BEDROCKWS_DENO_HOST")!,
  port: parseInt(Deno.env.get("BEDROCKWS_DENO_PORT")!),
});
