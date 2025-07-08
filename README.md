# Bedrock WebSocket

A Minecraft: Bedrock Edition WebSocket implementation in Deno/TypeScript.

```typescript
const server = new Server();

server.on("playerMessage", (event: PlayerMessageEvent) => {
  const { client, data } = event;
  if (Object.values(consts.names).includes(data.sender)) {
    return;
  }
  client.run(`say ${data.message}`);
});
```

## Examples

You can configure the host and port in the `.env` file. See also
<https://docs.deno.com/runtime/reference/env_variables/>.

```console
deno run --env-file -A examples/echo.ts
```
