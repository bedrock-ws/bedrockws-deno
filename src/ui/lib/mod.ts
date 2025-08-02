// TODO: Escaping does not seems to be possible directly as every /§./ will
//       either enable some style or not included in the output if invalid.

import * as xml from "@melvdouc/xml-parser";
import * as html from "@std/html";

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

export function strip(text: string) {
  return text.replaceAll(/§./g, "");
}

/**
 * Styles text smartly with support for nested styles.
 *
 * @example
 * style`foo <red>bar <bold>baz</bold> blah</red> blup`
 */
export function style(template: TemplateStringsArray, ...params: unknown[]) {
  let sanitized = "";
  for (const i in template) {
    const left = template[i];
    const right = html.escape(strip(`${params[i] ?? ""}`));
    sanitized += `${left}${right}`;
  }

  return html.unescape(transformXML(xml.parse(sanitized), []));
}

function transformXML(nodes: xml.XmlNode[], restore: (string | undefined)[]) {
  let result = "";
  console.debug({ nodes });
  let index = 0;
  for (const node of nodes) {
    const lastTagNode = index + 1 == nodes.filter((n) =>
      n.kind === "REGULAR_TAG_NODE"
    ).length;
    if (node.kind === "REGULAR_TAG_NODE") {
      index++;
      const codesWithLowercasedKeys = Object.fromEntries(
        Object.entries({...codes.colors, ...codes.formatting}).map(([key, value]) => [key.toLowerCase(), value]),
      );
      const code = codesWithLowercasedKeys[node.tagName.toLowerCase()];
      result += code ?? "";
      restore.push(code);
      result += transformXML(node.children, restore);
      if (lastTagNode) {
        restore.pop();
        result += `§r${restore.filter((x) => x !== undefined).join("")}`;
      }
    }
    if (node.kind === "TEXT_NODE") {
      result += node.value;
    }
  }
  return result;
}
