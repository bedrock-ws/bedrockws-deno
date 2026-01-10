# `@bedrock-ws/ui`

This library provides an interface for UI related things of MCBE. This mainly
includes appearance of text.

## Usage

```typescript
import { style } from "@bedrock-ws/ui";

// ... create a server ...

const message = style`<red>A<bold>B</bold>C</red>`;
for (const client of server.clients) {
  client.sendMessage(message);
}
```

```typescript
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

bot.launch({ hostname: "0.0.0.0", port: 6464 });
```
