/**
 * A bench marking script that measures the time for running a sequence of
 * commands.
 */

import { consts, Server } from "@bedrock-ws/bedrockws";
import type { PlayerMessageEvent } from "@bedrock-ws/bedrockws/events";

const amount = 1_000;
const server = new Server();

server.on("PlayerMessage", async (event: PlayerMessageEvent) => {
  if ((Object.values(consts.names) as string[]).includes(event.data.sender)) {
    return;
  }

  console.time("w/o await");
  for (let i = 1; i <= amount; i++) {
    event.client.run(`say ${i}/${amount}`);
  }
  console.timeLog("w/o await");

  console.time("w/ await");
  for (let i = 1; i <= amount; i++) {
    await event.client.run(`say ${i}/${amount}`);
  }
  console.timeLog("w/ await");
});

server.launch({
  hostname: Deno.env.get("BEDROCKWS_DENO_HOST")!,
  port: parseInt(Deno.env.get("BEDROCKWS_DENO_PORT")!),
});
