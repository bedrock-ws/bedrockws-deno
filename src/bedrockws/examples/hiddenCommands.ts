/**
 * A server that executes whatever command is entered in the chat.
 *
 * This is intended to try out hidden commands only executable by a WebSocket
 * client. These commands include:
 *
 * - `querytarget`: This always fails.
 * - `geteduclientinfo`: This always fails.
 * - `getlocalplayername`: Returns the player name of the connected client.
 */

import { consts, Server } from "@bedrock-ws/bedrockws";
import type {
  ConnectEvent,
  PlayerMessageEvent,
  ReadyEvent,
} from "@bedrock-ws/bedrockws/events";
import type { RawText } from "@minecraft/server";

const server = new Server();

server.on("ready", (event: ReadyEvent) => {
  console.log(`Ready at ${event.hostname}:${event.port}`);
});

server.on("connect", (event: ConnectEvent) => {
  const { client } = event;
  const message: RawText = {
    rawtext: [
      { text: "Try out the commands below! Omit the slash prefix.\n" },
      { text: "querytarget\n" },
      { text: "geteduclientinfo\n" },
      { text: "getlocalplayername" },
    ],
  };
  client.run(`tellraw @s ${JSON.stringify(message)}`);
});

server.on("playerMessage", async (event: PlayerMessageEvent) => {
  const { client, data } = event;
  if (Object.values(consts.names).includes(data.sender)) {
    return;
  }

  const result = await client.run(data.message);
  console.debug(result);
  client.run(`tell @s ${JSON.stringify(result)}`);
});

server.launch({
  hostname: Deno.env.get("BEDROCKWS_DENO_HOST")!,
  port: parseInt(Deno.env.get("BEDROCKWS_DENO_PORT")!),
});
