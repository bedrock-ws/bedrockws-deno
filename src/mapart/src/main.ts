// TODO: command for pixelart and mapart separately
// TODO: option for custom palette

import { Bot, CommandParamType } from "@bedrock-ws/bot";
import * as ui from "@bedrock-ws/ui";
import blockPalette from "./block_palette.json" with { type: "json" };
import sharp from "sharp";
import { exists } from "@std/fs/exists";
import { Client } from "@bedrock-ws/bedrockws";

type Vec3 = { x: number; y: number; z: number };
type Rgb = [number, number, number];

const mapSize = 128;
const preferredTickingAreaNameLength = 15;

/**
 * Finds out the nearest edge coordinate of a map (top left of map).
 */
function nearestMapEdge(location: Vec3): Vec3 {
  // (0, 0) is the bottom right block of the middle of the map. (-64, -64) is
  // the corner of the map at (0, 0). A map has a height and width of 128
  // blocks.
  const { x, y, z } = location;
  const closest = (n: number) =>
    mapSize / 2 + mapSize * Math.round((n - mapSize / 2) / mapSize);
  return { x: closest(x), y, z: closest(z) };
}

/**
 * Finds the nearest available color in a palette.
 *
 * This function only returns `undefined` when the palette is empty.
 */
function nearestColor(color: Rgb, palette: Rgb[]): Rgb | undefined {
  let nearest: { difference: number; color: Rgb } | undefined = undefined;
  for (const availableColor of palette) {
    const difference = Math.sqrt(
      Math.abs(availableColor[0] - color[0]) ** 2 +
        Math.abs(availableColor[1] - color[1]) ** 2 +
        Math.abs(availableColor[2] - color[2]) ** 2,
    );
    if (difference === 0) {
      return color;
    }
    if (nearest === undefined || nearest.difference > difference) {
      nearest = { difference, color: availableColor };
    }
  }
  return nearest?.color;
}

function hexToRgb(hexString: string): Rgb {
  const n = parseInt(hexString, 16);

  return [
    (n >> 16) & 0xFF,
    (n >> 8) & 0xFF,
    (n >> 0) & 0xFF,
  ];
}

function rgbToHex(r: number, g: number, b: number) {
  return ((r << 16) | (g << 8) | b << 0).toString(16).padStart(6, "0");
}

function generateNoise(length: number) {
  let result = "";
  const noiseChars = "abcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * noiseChars.length);
    result += noiseChars.charAt(index);
  }
  return result;
}

enum LogLevel {
  Error,
  Success,
}

function logChat(client: Client, level: LogLevel, message: string) {
  if (level === LogLevel.Error) {
    client.sendMessage(
      ui.style`<darkGray>[<red>error</red>]</darkGray> ${message}`,
    );
  } else if (level === LogLevel.Success) {
    client.sendMessage(ui.style`<darkGray[<green>success</green>] ${message}`);
  } else {
    level satisfies never;
  }
}

const bot = new Bot({ commandPrefix: "-" });

bot.cmd({
  name: "mapart",
  mandatoryParameters: [{ name: "path", type: CommandParamType.String }],
  optionalParameters: [
    { name: "resize_method", type: CommandParamType.String },
    { name: "downsize_kernel", type: CommandParamType.String },
    { name: "background_color", type: CommandParamType.String },
  ],
}, async (origin, ...args) => {
  const { client } = origin;

  const path = args.shift() as string;
  const resizeMethod = (args.shift() as string | undefined) ?? "contain";
  const downsizeKernel = (args.shift() as string | undefined) ?? "nearest";
  const backgroundColor = (args.shift() as string | undefined) ?? "white";

  if (!await exists(path, { isFile: true })) {
    logChat(client, LogLevel.Error, `No file found at ${path}`);
    return;
  }

  // TODO: validate path is in supplied ROOT

  const playerPosition = (await client.queryPlayer()).position;
  const edgeCoordinates = nearestMapEdge(playerPosition);

  const tickingAreaNamePrefix = "mapart_";
  const tickingAreaName = tickingAreaNamePrefix +
    generateNoise(
      Math.max(
        0,
        preferredTickingAreaNameLength - tickingAreaNamePrefix.length,
      ),
    );

  // We use 0 here for the height because it is irrelevant for a ticking
  // area.
  // TODO: verify this.
  const response = await client.run(
    `tickingarea add ${edgeCoordinates.x} 0 ${edgeCoordinates.z} ${
      edgeCoordinates.x + mapSize
    } 0 ${edgeCoordinates.z + mapSize} ${tickingAreaName}`,
  );
  console.debug(response, response.ok);
  if (!response.ok) {
    logChat(
      client,
      LogLevel.Error,
      "Failed to create ticking area. Probable cause is that the maximum amount of ticking areas have been used already. It is required to delete one ticking area.",
    );
    return;
  }

  // TODO: lock player
  // TODO: mind alpha channel
  const image = sharp(path).resize(mapSize, mapSize, {
    fit: resizeMethod,
    kernel: downsizeKernel,
    background: backgroundColor,
  });
  const data = await image.raw().toBuffer();
  const pixels = new Uint8ClampedArray(data.buffer);
  const palette = Object.keys(blockPalette).map(hexToRgb);
  for (let i = 0; i < pixels.length; i += 3) {
    // TODO: progress bar might slow it down; instead print in termnial if it
    //       in fact does
    const progress = i / pixels.length;
    const barsAmount = 20;
    const progressDisplay = `${":solid_star:".repeat(barsAmount * progress)}${
      ":hollow_star:".repeat(Math.ceil(barsAmount * (1 - progress)))
    } ${Math.floor(progress * 100)}%`;
    client.run(`title @a actionbar ${progressDisplay}`);

    const [r, g, b] = pixels.subarray(i, i + 3);
    const targetRgb = nearestColor([r, g, b], palette)!;
    const targetHex = rgbToHex(...targetRgb).toUpperCase();
    const block = blockPalette[targetHex as keyof typeof blockPalette];
    console.debug({block});
  }

  client.run(`tickingarea remove ${tickingAreaName}`);
});

bot.launch({
  hostname: Deno.env.get("BEDROCKWS_DENO_HOST")!,
  port: parseInt(Deno.env.get("BEDROCKWS_DENO_PORT")!),
});
