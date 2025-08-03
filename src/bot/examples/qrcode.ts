/**
 * Example illustrating how to generate and display QR Codes in the Minecraft
 * chat.
 */

import { Bot, CommandParamType } from "@bedrock-ws/bot";
import type { Command, CommandArgument, CommandOrigin } from "@bedrock-ws/bot";
import * as ui from "@bedrock-ws/ui";
import { qrcode } from "@libs/qrcode";

const bot = new Bot({ commandPrefix: "." });

const qrCommand: Command = {
  name: "qr",
  description: "Generates a QR code in the chat",
  mandatoryParameters: [
    { type: CommandParamType.String, name: "data" },
  ],
  examples: [
    {
      description: "Generate a QR code of text",
      args: ["'Hello World'"],
    },
    {
      description: "Generate a QR code of a URL",
      args: ["'https://github.com/bedrock-ws'"],
    },
  ],
};

bot.cmd(qrCommand, (origin: CommandOrigin, ...args: CommandArgument[]) => {
  const { client } = origin;
  const data = args.shift() as string;
  const qrMatrix = qrcode(data);

  // Sending each row separately is highly recommended as Minecraft as a
  // quite low maximum message length.
  const messageRows = qrMatrix.map((row) =>
    row.map((column) =>
      `${column ? ui.codes.colors.black : ui.codes.colors.white}\u2588`
    ).join("")
  );
  for (const message of messageRows) {
    client.sendMessage(message);
  }
});

bot.launch({
  hostname: Deno.env.get("BEDROCKWS_DENO_HOST")!,
  port: parseInt(Deno.env.get("BEDROCKWS_DENO_PORT")!),
});
