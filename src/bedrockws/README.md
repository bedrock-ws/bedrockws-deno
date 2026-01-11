# `@bedrock-ws/bedrockws`

## Usage

```typescript
import { consts, Server } from "@bedrock-ws/bedrockws";

const server = new Server();

server.on("PlayerMessage", (event) => {
  const { client, data } = event;
  if ((Object.values(consts.names) as string[]).includes(data.sender)) {
    // don't react on messages sent by the server
    return;
  }
  client.run(`say ${data.message}`);
});
```
