/**
 * A server that executes whatever command is entered in the chat.
 *
 * This is intended to try out hidden commands only executable by a WebSocket
 * client. These commands include:
 *
 * - `querytarget`: Returns dimension, id, position, unique ID and y-rotation
 *    of the queried target.
 * - `geteduclientinfo`: This always fails.
 * - `getlocalplayername`: Returns the player name of the connected client.
 * - `gettopsolidblock`: Gets the position of the top non-air block below the
 *   specified position.
 *
 * # References
 *
 * - <https://minecraft.wiki/w/Commands/querytarget>
 * - <https://minecraft.wiki/w/Commands/getlocalplayername>
 * - <https://minecraft.wiki/w/Commands/geteduclientinfo>
 * - <https://minecraft.wiki/w/Commands/gettopsolidblock>
 */

import { consts, Server } from "@bedrock-ws/bedrockws";
import type {
  ConnectEvent,
  PlayerMessageEvent,
  ReadyEvent,
} from "@bedrock-ws/bedrockws/events";
import type { RawText } from "@minecraft/server";

const server = new Server();

server.on("Ready", (event: ReadyEvent) => {
  console.log(`Ready at ${event.hostname}:${event.port}`);
});

server.on("Connect", (event: ConnectEvent) => {
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

server.on("PlayerMessage", async (event: PlayerMessageEvent) => {
  const { client, data } = event;
  if ((Object.values(consts.names) as string[]).includes(event.data.sender)) {
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
