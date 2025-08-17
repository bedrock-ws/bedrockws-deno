// TODO: command for pixelart and mapart separately
// TODO: option for custom palette
// TODO: prevent snow from spawning on blocks
// TODO: teleport to edge of next map art

import { Bot, CommandParamType } from "@bedrock-ws/bot";
import * as ui from "@bedrock-ws/ui";
import blockPalette from "./palettes/map_palette.json" with { type: "json" };
import sharp from "sharp";
import { exists } from "@std/fs/exists";
import { Client } from "@bedrock-ws/bedrockws";

type Vec3 = { x: number; y: number; z: number };
type Rgb = [number, number, number];
type LogLevel = "success" | "error";
interface PaletteEntry {
  normal: Rgb;
  dark: Rgb;
  darker: Rgb;
  darkest: Rgb;
}
type Shade = keyof PaletteEntry;

const mapSize = 128;
const heightBase = 100;
const shadeOffset = 2;
const preferredTickingAreaNameLength = 15;

/**
 * Finds out the edge coordinates of the map area the player is currently in.
 */
function localMapEdge(location: Vec3): Vec3 {
  // (0, 0) is the bottom right block of the middle of the map. (-64, -64) is
  // the corner of the map at (0, 0). A map has a height and width of 128
  // blocks.
  const { x, y, z } = location;
  const closest = (n: number) =>
    mapSize / 2 + mapSize * Math.floor((n - mapSize / 2) / mapSize);
  return { x: closest(x), y, z: closest(z) };
}

/**
 * Finds the nearest available color in a palette.
 *
 * This function only returns `undefined` when the palette is empty.
 */
function nearestColor(
  color: Rgb,
  palette: PaletteEntry[],
): { shadedColor: Rgb; originalColor: Rgb; shade: Shade } | undefined {
  let nearest: {
    difference: number;
    shadedColor: Rgb;
    originalColor: Rgb;
    shade: Shade;
  } | undefined = undefined;
  for (const availableColors of palette) {
    for (
      const [shadeString, availableColor] of Object.entries(availableColors)
    ) {
      const shade = shadeString as Shade;
      const difference = Math.sqrt(
        (availableColor[0] - color[0]) ** 2 +
          (availableColor[1] - color[1]) ** 2 +
          (availableColor[2] - color[2]) ** 2,
      );
      const data = {
        shadedColor: availableColor,
        originalColor: availableColors["normal"],
        shade,
      };
      if (difference === 0) {
        return data;
      }
      if (nearest === undefined || nearest.difference > difference) {
        nearest = { difference, ...data };
      }
    }
  }
  return nearest === undefined ? undefined : { ...nearest };
}

function hexToRgb(hexString: string): Rgb {
  const n = parseInt(hexString, 16);

  return [
    (n >> 16) & 0xFF,
    (n >> 8) & 0xFF,
    (n >> 0) & 0xFF,
  ];
}

function rgbToHex(color: Rgb) {
  return ((color[0] << 16) | (color[1] << 8) | color[2] << 0).toString(16)
    .padStart(6, "0");
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

/**
 * Returns an array of the possible shades of a base map color.
 *
 * @see https://minecraft.wiki/w/Map_item_format#Map_colors
 */
function withShades(color: Rgb): PaletteEntry {
  return {
    darker: applyShade(color, "darker"),
    darkest: applyShade(color, "darkest"),
    normal: applyShade(color, "normal"),
    dark: applyShade(color, "dark"),
  };
}

function applyShade(color: Rgb, shade: Shade): Rgb {
  let multiplier;
  switch (shade) {
    case "normal":
      multiplier = 1;
      break;
    case "dark":
      multiplier = 0.53;
      break;
    case "darker":
      multiplier = 0.71;
      break;
    case "darkest":
      multiplier = 0.86;
      break;
  }
  return [
    Math.floor(color[0] * multiplier),
    Math.floor(color[1] * multiplier),
    Math.floor(color[2] * multiplier),
  ];
}

function logChat(client: Client, level: LogLevel, message: string) {
  if (level === "error") {
    client.sendMessage(
      ui.style`<darkGray>[<red>error</red>]</darkGray> ${message}`,
    );
  } else if (level === "success") {
    client.sendMessage(ui.style`<darkGray[<green>success</green>] ${message}`);
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
    logChat(client, "error", `No file found at ${path}`);
    return;
  }

  // TODO: validate path is in supplied ROOT

  const playerPosition = (await client.queryPlayer()).position;
  const edgeCoordinates = localMapEdge(playerPosition);

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
  if (!response.ok) {
    logChat(
      client,
      "error",
      "Failed to create ticking area. Probable cause is that the maximum amount of ticking areas have been used already. It is required to delete one ticking area.",
    );
    return;
  }

  await client.run(
    `tp ${edgeCoordinates.x} ${heightBase} ${edgeCoordinates.z}`,
  );

  // TODO: mind alpha channel
  const image = sharp(path).resize(mapSize, mapSize, {
    fit: resizeMethod,
    kernel: downsizeKernel,
    background: backgroundColor,
  });
  const data = await image.raw().toBuffer();
  const pixels = new Uint8ClampedArray(data.buffer);
  const palette = Object.keys(blockPalette).map((hex) =>
    withShades(hexToRgb(hex))
  );
  console.debug(palette);

  let previousShade: Shade | undefined = undefined;
  let step = 0;
  for (let z = 0; z < mapSize; z++) {
    for (let x = 0; x < mapSize; x++) {
      // TODO: progress bar might slow it down; instead print in termnial if it
      //       in fact does
      const progress = step / mapSize ** 2;
      const barsAmount = 20;
      const progressDisplay = `${":solid_star:".repeat(barsAmount * progress)}${
        ":hollow_star:".repeat(Math.ceil(barsAmount * (1 - progress)))
      } ${Math.floor(progress * 100)}%`;
      client.run(`title @a actionbar ${progressDisplay}`);

      const [r, g, b] = pixels.subarray(step * 3, step * 3 + 3);
      const { originalColor, shade } = nearestColor([r, g, b], palette)!;
      previousShade = shade;
      const hexKey = rgbToHex(originalColor).toUpperCase();
      let block = blockPalette[hexKey as keyof typeof blockPalette];

      // TODO: use switch, it's more readable
      const y = previousShade === undefined
        ? 0
        : previousShade === "normal"
        ? 0
        : previousShade === "dark"
        ? shadeOffset
        : previousShade === "darker"
        ? shadeOffset * 2
        : previousShade === "darkest"
        ? shadeOffset * 3
        : 0;

      if (typeof block !== "string") {
        const topBlock = block.top;
        client.run(
          `execute positioned ${edgeCoordinates.x} ${edgeCoordinates.y} ${edgeCoordinates.z} run setblock ~${x} ~${
            y + 1
          } ~${z} ${topBlock}`,
        );
        block = block.self;
      }

      client.run(
        `execute positioned ${edgeCoordinates.x} ${heightBase} ${edgeCoordinates.z} run setblock ~${x} ~${y} ~${z} ${block}`,
      );

      step++;
    }
  }
  // TODO: one extra row of any block

  client.run(`tickingarea remove ${tickingAreaName}`);
});

bot.launch({
  hostname: Deno.env.get("BEDROCKWS_DENO_HOST")!,
  port: parseInt(Deno.env.get("BEDROCKWS_DENO_PORT")!),
});
