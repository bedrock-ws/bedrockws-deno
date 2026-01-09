/**
 * A simple echo implementation useful for quickly testing functionality.
 */

import { consts, Server } from "@bedrock-ws/bedrockws";
import type {
  ConnectEvent,
  DisconnectEvent,
  PlayerMessageEvent,
  ReadyEvent,
} from "@bedrock-ws/bedrockws/events";

const server = new Server();

server.on("Ready", (event: ReadyEvent) => {
  console.log(`Ready at ${event.hostname}:${event.port}`);
});

server.on("Connect", (event: ConnectEvent) => {
  const { client } = event;
  client.run("say Hello World 1!");
  client.run("say Hello World 2!");
  client.run("say Hello World 3!");
  client.run("say Hello World 4!");
});

server.on("Disconnect", (event: DisconnectEvent) => {
  const { client, code } = event;
  console.log(`Disconnection of client ${client} (reason: ${code})`);
});

server.on("PlayerMessage", (event: PlayerMessageEvent) => {
  if ((Object.values(consts.names) as string[]).includes(event.data.sender)) {
    return;
  }
  const { message } = event.data;
  switch (message) {
    case "ping":
      event.reply("pong");
      break;
    case "close":
      event.client.close();
      break;
    case "crash":
      throw new Error("intentional user caused crash");
    default:
      event.reply(message);
  }
});

server.launch({
  hostname: Deno.env.get("BEDROCKWS_DENO_HOST")!,
  port: parseInt(Deno.env.get("BEDROCKWS_DENO_PORT")!),
});
