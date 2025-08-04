import * as xml from "@rgrove/parse-xml";
import * as html from "@std/html";

// TODO: doc
export const codes = {
  colors: {
    /** Color code that represents #000000. */
    black: "§0",

    /** Color code that represents  #0000AA. */
    darkBlue: "§1",

    darkGreen: "§2",

    darkAqua: "§3",

    darkRed: "§4",

    darkPurple: "§5",

    gold: "§6",

    gray: "§7",

    darkGray: "§8",

    blue: "§9",

    green: "§a",

    aqua: "§b",

    red: "§c",

    lightPurple: "§d",

    yellow: "§e",

    white: "§f",

    minecoinGold: "§g",

    materialQuartz: "§h",

    materialIron: "§i",

    materialNetherite: "§j",

    materialRedstone: "§m",

    materialCopper: "§n",

    materialGold: "§p",

    materialEmerald: "§q",

    materialDiamond: "§s",

    materialLapis: "§t",

    materialAmethyst: "§u",

    materialResin: "§v",
  },

  formatting: {
    obfuscated: "§k",

    bold: "§l",

    italic: "§o",

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
  console.debug({ nodes });
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
