/**
 * An example that allows you to execute Minecraft commands from the terminal.
 */

import { Server } from "@bedrock-ws/bedrockws";
import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

const server = new Server();
const rl = readline.createInterface({ input: stdin, output: stdout });

rl.on("line", (line) => {
  server.clients.forEach((client) => {
    client.run(line);
  })
})

server.launch({
  hostname: Deno.env.get("BEDROCKWS_DENO_HOST")!,
  port: parseInt(Deno.env.get("BEDROCKWS_DENO_PORT")!),
});
