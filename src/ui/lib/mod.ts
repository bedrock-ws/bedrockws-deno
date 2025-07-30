// TODO: Escaping does not seems to be possible directly as every /§./ will
//       either enable some style or not included in the output if invalid.

import * as xml from "@melvdouc/xml-parser";

export const codes = {
  /** Color code that represents #000000. */
  black: "§0",

  /** Color code that represents  #0000AA. */
  dark_blue: "§1",

  dark_green: "§2",

  dark_aqua: "§3",

  dark_red: "§4",

  dark_purple: "§5",

  gold: "§6",

  gray: "§7",

  dark_gray: "§8",

  blue: "§9",

  green: "§a",

  aqua: "§b",

  red: "§c",

  light_purple: "§d",
  // TODO: rest
} as const;

export function strip(text: string) {
  return text.replaceAll(/§./, "");
}

/**
 * Styles text smartly with support for nested styles.
 *
 * @example
 * style`foo <red>bar <bold>baz</bold> blah</red> blup`
 */
export function style(template: TemplateStringsArray, ...params: string[]) {
  // TODO: escape interpolated values
  return "TODO";
}
