import { Bot, floatParamType, integerParamType } from "@bedrock-ws/bot";
import type { Command, CommandArgument, CommandOrigin } from "@bedrock-ws/bot";

function factorial(n: number): number {
  if (n < 0) throw new Error("Negative numbers not allowed");
  return n <= 1 ? 1 : n * factorial(n - 1);
}

const bot = new Bot({ commandPrefix: "." });

const sinCommand: Command = {
  name: "sin",
  description: "Calculates the sine",
  mandatoryParameters: [
    { type: floatParamType, name: "number" },
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
    { type: floatParamType, name: "number" },
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

const factCommand: Command = {
  name: "fact",
  description: "Calculates the factorial",
  mandatoryParameters: [
    { type: integerParamType, name: "number" },
  ],
  examples: [{
    description: "Calculate the factorial of 5",
    args: ["5"],
  }]
}

bot.cmd(factCommand, (origin: CommandOrigin, ...args: CommandArgument[]) => {
  const { client } = origin;
  const n = args.shift() as number;
  client.sendMessage(`fact(${n}) = ${factorial(n)}`);
});

bot.launch({
  hostname: Deno.env.get("BEDROCKWS_DENO_HOST")!,
  port: parseInt(Deno.env.get("BEDROCKWS_DENO_PORT")!),
});
