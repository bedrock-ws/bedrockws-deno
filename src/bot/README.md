# `@bedrock-ws/bot`

This auxillary library helps creating Minecraft-like commands.

## Usage

```typescript
import { Bot, stringParamType } from "@bedrock-ws/bot";
import type { Command, CommandArgument, CommandOrigin } from "@bedrock-ws/bot";

const bot = new Bot({ commandPrefix: "." });

const greetCommand: Command = {
  name: "greet",
  aliases: ["sayhello", "welcome"],
  description: "Greets a player",
  optionalParameters: [
    { type: stringParamType, name: "target", default: { value: "everyone" } },
  ],
  examples: [{
    description: "Greet a player named Steve",
    args: ["Steve"],
  }],
};

bot.cmd(greetCommand, (origin: CommandOrigin, ...args: CommandArgument[]) => {
  const { initiator, client } = origin;
  const target = args.shift() as string;
  client.sendMessage(`${initiator} greets ${target}!`);
});

bot.launch({ hostname: "0.0.0.0", port: 6464 });
```
