// TODO: command for pixelart and mapart separately
// TODO: option for custom palette

import { Bot, CommandParamType } from "@bedrock-ws/bot";
import blockPalette from "./block_palette.json" with { type: "json" };
import sharp from "sharp";
import { exists } from "@std/fs/exists";

type Vec3 = { x: number; y: number; z: number };
type Rgb = [number, number, number];

const mapSize = 128;

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

const bot = new Bot({ commandPrefix: "-" });

bot.cmd({
  name: "mapart",
  mandatoryParameters: [{ name: "path", type: CommandParamType.String }],
  optionalParameters: [
    { name: "resize_method", type: CommandParamType.String },
    { name: "downsize_kernel", type: CommandParamType.String },
  ],
}, async (origin, ...args) => {
  const { client } = origin;

  const path = args.shift() as string;
  const resizeMethod = (args.shift() as string | undefined) ?? "inside";
  const downsizeKernel = (args.shift() as string | undefined) ?? "nearest";

  if (!await exists(path, { isFile: true })) {
    // TODO: emit error
    return;
  }
  // TODO: validate path is in supplied ROOT

  const playerPosition = (await client.queryPlayer()).position;
  const edgeCoordinates = nearestMapEdge(playerPosition);

  // We use 0 here for the height because it is irrelevant for a ticking
  // area.
  // TODO: Validate this.
  const response = await client.run(
    `tickingarea add ${edgeCoordinates.x} 0 ${edgeCoordinates.z} ${
      edgeCoordinates.x + mapSize
    } 0 ${edgeCoordinates.z + mapSize} `,
  );
  console.debug({ response });
  // TODO: abort with error message if the command fails, because it means there
  //       are too many ticking areas
  if (!response.ok) {
    // TODO: emit error
    return;
  }

  // TODO: lock player
  // TODO: resize image
  // TODO: mind alpha channel
  const data = await sharp(path).raw().toBuffer();
  const pixels = new Uint8ClampedArray(data.buffer);
  const palette = Object.keys(blockPalette).map(hexToRgb);
  for (let i = 0; i < pixels.length; i += 3) {
    // TODO: map pixel to block and place
    const [r, g, b] = pixels.subarray(i, i + 3);
    const targetRgb = nearestColor([r, g, b], palette)!;
    console.debug({ targetRgb });
    const targetHex = rgbToHex(...targetRgb).toUpperCase();
    console.debug({ targetHex });
    const block = blockPalette[targetHex as keyof typeof blockPalette];
    console.debug({ block });
  }

  // TODO: remove ticking area
});

bot.launch({
  hostname: Deno.env.get("BEDROCKWS_DENO_HOST")!,
  port: parseInt(Deno.env.get("BEDROCKWS_DENO_PORT")!),
});
