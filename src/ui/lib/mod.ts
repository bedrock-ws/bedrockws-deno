import * as xml from "@rgrove/parse-xml";
import * as html from "@std/html";

export const codes = {
  colors: {
    /** Color code that represents #000000. */
    black: "§0",

    /** Color code that represents #0000AA. */
    darkBlue: "§1",

    /** Color code that represents #00AA00. */
    darkGreen: "§2",

    /** Color code that represents #00AAAA. */
    darkAqua: "§3",

    /** Color code that represents #AA0000. */
    darkRed: "§4",

    /** Color code that represents #AA00AA. */
    darkPurple: "§5",

    /** Color code that represents #FFAA00. */
    gold: "§6",

    /** Color code that represents #C6C6C6. */
    gray: "§7",

    /** Color code that represents #555555. */
    darkGray: "§8",

    /** Color code that represents #5555FF. */
    blue: "§9",

    /** Color code that represents #55FF55. */
    green: "§a",

    /** Color code that represents #55FFFF. */
    aqua: "§b",

    /** Color code that represents #FF5555. */
    red: "§c",

    /** Color code that represents #FF55FF. */
    lightPurple: "§d",

    /** Color code that represents #FFFF55. */
    yellow: "§e",

    /** Color code that represents #FFFFFF. */
    white: "§f",

    /** Color code that represents #DDD605. */
    minecoinGold: "§g",

    /** Color code that represents #E3D4D1. */
    materialQuartz: "§h",

    /** Color code that represents #CECACA. */
    materialIron: "§i",

    /** Color code that represents #443A3B. */
    materialNetherite: "§j",

    /** Color code that represents #971607. */
    materialRedstone: "§m",

    /** Color code that represents #B4684D. */
    materialCopper: "§n",

    /** Color code that represents #DEB12D. */
    materialGold: "§p",

    /** Color code that represents #119F36. */
    materialEmerald: "§q",

    /** Color code that represents #2CBAA8. */
    materialDiamond: "§s",

    /** Color code that represents #21497B. */
    materialLapis: "§t",

    /** Color code that represents #9A5CC6. */
    materialAmethyst: "§u",

    /** Color code that represents #EB7114. */
    materialResin: "§v",
  },

  formatting: {
    /** Code to make text obfuscated. */
    obfuscated: "§k",

    /** Code to make text bold. */
    bold: "§l",

    /** Code to make text italic. */
    italic: "§o",

    /** Reset style. */
    reset: "§r",
  },
} as const;

/**
 * Strips all style codes like `§a` from a string.
 */
export function strip(text: string) {
  return text.replaceAll(/§./g, "");
}

export interface StyleOptions {
  /** Whether to escape XML for interpolated values. */
  escapeXml?: boolean;

  /** Whether to strip style codes within interpolated values. */
  stripCodes?: boolean;
}

/**
 * Styles text smartly with support for nested styles.
 *
 * @example
 * style`foo <red>bar <bold>baz</bold> blah</red> blup`
 */
export function style(template: TemplateStringsArray, ...params: unknown[]) {
  return styleWithOptions({})(
    template,
    ...params,
  );
}

/**
 * Styles text smartly with support for nested styles.
 *
 * @example
 * styleWithOptions({ escapeXml: false, stripCodes: false })`foo <red>bar <bold>baz</bold> blah</red> blup`
 */
export function styleWithOptions(options: StyleOptions) {
  return function (template: TemplateStringsArray, ...params: unknown[]) {
    let sanitized = "";
    for (const i in template) {
      const left = template[i];

      let right = `${params[i] ?? ""}`;
      if (options.stripCodes ?? true) right = strip(right);
      if (options.escapeXml ?? true) right = html.escape(right);

      sanitized += `${left}${right}`;
    }

    const root = xml.parseXml(`<ROOT>${sanitized}</ROOT>`);
    const { children } = root.children[0] as xml.XmlElement;
    let rendered = html.unescape(transformXML(children, []));
    if (
      rendered.slice(rendered.length - codes.formatting.reset.length) !==
        codes.formatting.reset
    ) {
      rendered += codes.formatting.reset;
    }
    return rendered;
  };
}

function transformXML(nodes: xml.XmlNode[], restore: (string | undefined)[]) {
  let result = "";
  let index = 0;
  for (const node of nodes) {
    const lastTagNode = index + 1 == nodes.filter((n) =>
      n.type === xml.XmlNode.TYPE_ELEMENT
    ).length;

    if (node.type === xml.XmlNode.TYPE_ELEMENT) {
      index++;
      const nodeElement = node as xml.XmlElement;
      const codesWithLowercasedKeys = Object.fromEntries(
        Object.entries({ ...codes.colors, ...codes.formatting }).map((
          [key, value],
        ) => [key.toLowerCase(), value]),
      );
      const code = codesWithLowercasedKeys[nodeElement.name.toLowerCase()];
      result += code ?? "";
      restore.push(code);
      result += transformXML(nodeElement.children, restore);
      if (lastTagNode) {
        restore.pop();
        result += `${codes.formatting.reset}${
          restore.filter((x) => x !== undefined).join("")
        }`;
      }
    }

    if (node.type === xml.XmlNode.TYPE_TEXT) {
      const nodeText = node as xml.XmlText;
      result += nodeText.text;
    }
  }

  return result;
}
