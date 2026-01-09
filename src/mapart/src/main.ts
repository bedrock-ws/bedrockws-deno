// TODO: move this out into a separate repo containing several commands.
// TODO: option for custom palette
// TODO: prevent snow from spawning on blocks

import {
  booleanParamType,
  Bot,
  integerParamType,
  stringParamType,
} from "@bedrock-ws/bot";
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
const heightBase = 200; // TODO: should not conflict with world generation
const shadeOffset = 2;
const preferredTickingAreaNameLength = 15;
const barsAmount = 20;

const kernelValues = {
  nearest: "nearest",
  cubic: "cubic",
  linear: "linear",
  mitchell: "mitchell",
  lanczos2: "lanczos2",
  lanczos3: "lanczos3",
  mks2013: "mks2013",
  mks2021: "mks2021",
} as const satisfies sharp.KernelEnum;

const fitValues = {
  contain: "contain",
  cover: "cover",
  fill: "fill",
  inside: "inside",
  outside: "outside",
} as const satisfies sharp.FitEnum;

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

function displayEnumType(options: string[]) {
  return options.join("|");
}

const bot = new Bot({ commandPrefix: "-" });

bot.on("Ready", (_event) => {
  console.log("Ready!");
});

bot.on("Connect", (_event) => {
  console.log("Connected!");
});

bot.cmd({
  name: "mapart",
  description: ui
    .style`Generate a map art from an image. See also: <darkAqua>https://sharp.pixelplumbing.com/api-resize/</darkAqua> for the resizing methods`,
  mandatoryParameters: [{ name: "path", type: stringParamType }],
  optionalParameters: [
    // TODO: custom types/converters for enum values
    {
      name: "flat",
      type: booleanParamType,
      description:
        "Whether to place all blocks on one layer (may reduce details)",
      default: { value: false },
    },
    {
      name: "resize_method",
      type: {
        name: "resize-method",
        converter: ([raw]): keyof typeof fitValues => {
          if (raw in fitValues) {
            return fitValues[raw as keyof typeof fitValues];
          }
          throw new Error(
            `${raw} is not any of ${displayEnumType(Object.keys(fitValues))}`,
          );
        },
      },
      description: "The resizing method for non-square images",
      default: { value: "contain" },
    },
    {
      name: "downsize_kernel",
      type: {
        name: "downsize-kernel",
        converter: ([raw]): keyof typeof kernelValues => {
          if (raw in kernelValues) {
            return kernelValues[raw as keyof typeof kernelValues];
          }
          throw new Error(
            `${raw} is not any of ${
              displayEnumType(Object.keys(kernelValues))
            }`,
          );
        },
      },
      description: "The algorithm used for downscaling images",
      default: { value: "mitchell" },
    },
    {
      name: "background_color",
      type: stringParamType,
      description:
        "The background color used when resizing or for transparent pixels",
      default: { value: "white" },
    },
    {
      name: "alpha_threshold",
      type: integerParamType,
      description:
        "The minimum alpha value (0-255) to consider a pixel as transparent",
      default: { value: 128 },
    },
  ],
  examples: [
    {
      description: "Crop the image to fit on a map",
      args: ["image.jpg", "false", "cover"],
    },
    {
      description: "Add blue borders around image to fit on a map",
      args: ["image.jpg", "false", "contain", "mitchell", "blue"],
    },
    {
      description: "Stretch image to fit on a map",
      args: ["image.jpg", "false", "fill"],
    },
    {
      description: "Use red blocks for (only) fully transparent pixels",
      args: ["image.png", "false", "fill", "mitchell", "red", "255"],
    },
  ],
}, async (origin, ...args) => {
  const { client } = origin;

  const path = args.shift() as string;
  const flat = args.shift() as boolean;
  const resizeMethod = args.shift() as keyof typeof fitValues;
  const downsizeKernel = args.shift() as keyof typeof kernelValues;
  const backgroundColor = args.shift() as string;
  const alphaThreshold = args.shift() as string;

  if (!await exists(path, { isFile: true })) {
    logChat(client, "error", `No file found at ${path}`);
    return;
  }

  // TODO: join path relative to ROOT
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
  // TODO: +1 for the extra stone row on the edge
  try {
    await client.run(
      `tickingarea add ${edgeCoordinates.x} 0 ${edgeCoordinates.z} ${
        edgeCoordinates.x + mapSize
      } 0 ${edgeCoordinates.z + mapSize} ${tickingAreaName}`,
    );
  } catch {
    logChat(
      client,
      "error",
      "Failed to create ticking area. Probable cause is that the maximum amount of ticking areas have been used already. It is required to delete one ticking area.",
    );
    return;
  }

  const image = sharp(path).resize(mapSize, mapSize, {
    fit: resizeMethod,
    kernel: downsizeKernel,
    background: backgroundColor,
  }).ensureAlpha();
  const data = await image.raw().toBuffer();
  const pixels = new Uint8ClampedArray(data.buffer);
  const palette = Object.keys(blockPalette).map((hex) =>
    withShades(hexToRgb(hex))
  );

  const setBlock = (x: number, y: number, z: number, block: string) => {
    client.run(
      `execute positioned ${edgeCoordinates.x} ${heightBase} ${edgeCoordinates.z} run setblock ~${x} ~${y} ~${z} ${block}`,
    ).catch(console.error); // TODO: log in chat
  };

  const displayProgress = (progress: number) => {
    const progressSymbolDone = "█";
    const progressSymbolLeft = "█";
    let progressDisplay = "";
    progressDisplay += ui.codes.colors.green;
    progressDisplay += progressSymbolDone.repeat(barsAmount * progress);
    progressDisplay += ui.codes.formatting.reset;
    progressDisplay += ui.codes.colors.gray;
    progressDisplay += progressSymbolLeft.repeat(
      Math.ceil(barsAmount * (1 - progress)),
    );
    progressDisplay += ui.codes.formatting.reset;
    progressDisplay += ` ${Math.floor(progress * 100)}%`;
    client.run(`title @a actionbar ${progressDisplay}`);
  };

  const channels = 4;
  let block;
  let previousShade: Shade | undefined = undefined;
  let step = 0;
  let pixelIndex = pixels.length / channels;
  for (let z = mapSize - 1; z >= -1; z--) {
    for (let x = mapSize - 1; x >= 0; x--) {
      // TODO: progress bar might slow it down; instead print in terminal if it
      //       in fact does
      const progress = step / mapSize ** 2;
      displayProgress(progress);

      let y;
      if (flat) {
        y = 0;
      } else {
        switch (previousShade) {
          case undefined:
            y = 0;
            break;
          case "normal":
            y = 0;
            break;
          case "dark":
            y = shadeOffset;
            break;
          case "darker":
            y = shadeOffset * 2;
            break;
          case "darkest":
            y = shadeOffset * 3;
            break;
          default:
            y = 0;
        }
      }

      if (z == -1) {
        block = "stone";
      } else {
        const [r, g, b, alpha] = pixels.subarray(
          pixelIndex * channels,
          pixelIndex * channels + channels,
        );
        const { originalColor, shade } = nearestColor([r, g, b], palette)!;
        previousShade = shade;
        const hexKey = rgbToHex(originalColor).toUpperCase();
        block = blockPalette[hexKey as keyof typeof blockPalette];
      }

      if (typeof block !== "string") {
        const topBlock = block.top;
        setBlock(x, y + 1, z, topBlock);
        block = block.self;
      }

      setBlock(x, y, z, block);

      step++;
      pixelIndex--;
    }
  }
  displayProgress(1);

  client.run(`tickingarea remove ${tickingAreaName}`);
});

bot.launch({
  hostname: Deno.env.get("BEDROCKWS_DENO_HOST")!,
  port: parseInt(Deno.env.get("BEDROCKWS_DENO_PORT")!),
});
