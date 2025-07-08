/**
 * A simple echo implementation useful for quickly testing functionality.
 */

import { consts, Server } from "@bedrock-ws/bedrockws";
import type {
  ConnectEvent,
  PlayerMessageEvent,
  ReadyEvent,
} from "@bedrock-ws/bedrockws/events";

const server = new Server();

server.on("ready", (event: ReadyEvent) => {
  console.log(`Ready at ${event.hostname}:${event.port}`);
});

server.on("connect", (event: ConnectEvent) => {
  event.client.run("say Hello World 1!");
  event.client.run("say Hello World 2!");
  event.client.run("say Hello World 3!");
  event.client.run("say Hello World 4!");
});

server.on("playerMessage", (event: PlayerMessageEvent) => {
  if (Object.values(consts.names).includes(event.data.sender)) {
    return;
  }
  const message = event.data.message === "ping" ? "pong" : event.data.message;
  event.reply(message);
});

server.launch({
  hostname: Deno.env.get("BEDROCKWS_DENO_HOST")!,
  port: parseInt(Deno.env.get("BEDROCKWS_DENO_PORT")!),
});
