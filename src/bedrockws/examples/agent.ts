/**
 * Example introducing how to use the agent.
 *
 * @see https://minecraft.wiki/w/Commands/agent
 * @see https://minecraft.wiki/w/Agent
 */

import { Server } from "@bedrock-ws/bedrockws";

const server = new Server();

server.on("Ready", (event) => {
  console.log(`Ready at ${event.hostname}:${event.port}`);
});

server.on("Connect", (event) => {
  const { client } = event;
  client.run("agent create");
});

server.launch({
  hostname: Deno.env.get("BEDROCKWS_DENO_HOST")!,
  port: parseInt(Deno.env.get("BEDROCKWS_DENO_PORT")!),
});
