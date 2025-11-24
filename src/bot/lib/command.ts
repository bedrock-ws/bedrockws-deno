import type { Client } from "@bedrock-ws/bedrockws";
import type { Bot } from "@bedrock-ws/bot";
import { style, styleWithOptions } from "@bedrock-ws/ui";
import { TypeError } from "./errors.ts";
import * as shlex from "shlex";

export interface Command {
  /**
   * The name of the command.
   *
   * This must not be empty and must not contain spaces.
   */
  name: string;

  /**
   * An array of aliases the command can invoked with as well.
   */
  aliases?: string[];

  /**
   * An optional description for the command.
   */
  description?: string;

  /**
   * Parameters that are required when invoking the command.
   */
  mandatoryParameters?: MandatoryCommandParameter<unknown>[];

  /**
   * Optional parameters of the command.
   *
   * These will be appended to the mandatory parameters.
   */
  optionalParameters?: OptionalCommandParameter<unknown>[];

  /**
   * Examples that explain usage of the command.
   */
  examples?: CommandUsageExample[];
}

export interface CommandUsageExample {
  description: string;
  args: string[];
}

export interface CommandParamType<T> {
  /** The name to represent the type. */
  name: string;

  converter: (raw: string[]) => T;

  /** The number of words this parameter type consumes. */
  take?: number;
}

export interface Location {
  x: { coord: number; relative: boolean };
  y: { coord: number; relative: boolean };
  z: { coord: number; relative: boolean };
}

export type CommandArgument = unknown;

export type CommandCallback = (
  origin: CommandOrigin,
  ...args: CommandArgument[]
) => void;

export interface CommandOrigin {
  /** The player name of the player who triggered the command. */
  readonly initiator: string;

  /** The client that received the command. */
  readonly client: Client;

  /** Reference to the bot this command belongs to. */
  readonly bot: Bot;
}

export interface CommandParameter<T> {
  /** The type of the parameter. */
  type: CommandParamType<T>;

  /** The name of the parameter. */
  name: string;

  /** The description of the parameter. */
  description?: string;
}

export interface MandatoryCommandParameter<T> extends CommandParameter<T> {}

export interface OptionalCommandParameter<T> extends CommandParameter<T> {
  /** The default value of the parameter. */
  default?: CommandParameterDefault<T>; // TODO: maybe support both raw (string) and converted value
}

export type CommandParameterDefault<T> =
  | CommandParameterDefaultRaw
  | CommandParameterDefaultValue<T>
  | CommandParameterDefaultFactory<T>;

interface CommandParameterDefaultWithOptionalRepresentation {
  representation?: string;
}

export interface CommandParameterDefaultFactory<T>
  extends CommandParameterDefaultWithOptionalRepresentation {
  factory: () => T;
}

export interface CommandParameterDefaultRaw {
  raw: string[];
}

export interface CommandParameterDefaultValue<T>
  extends CommandParameterDefaultWithOptionalRepresentation {
  value: T;
}

/**
 * Parameter type that keeps the input value as-is.
 */
export const stringParamType: CommandParamType<string> = {
  name: "string",
  converter: ([value]) => value,
};

/**
 * Parameter type that parses the input value as a boolean.
 *
 * Only `true` and `false` are valid input values.
 */
export const booleanParamType: CommandParamType<boolean> = {
  name: "boolean",
  converter: ([value]) => {
    if (value === "true") return true;
    if (value === "false") return false;
    throw new TypeError(`expected boolean; got ${value}`);
  },
};

/**
 * Parameter type that parses the input value as a number (both integer and
 * float).
 */
export const floatParamType: CommandParamType<number> = {
  name: "float",
  converter: ([value]) => {
    return stringToFloat(value);
  },
};

/**
 * Parameter type that parses the input value as an integer.
 */
export const integerParamType: CommandParamType<number> = {
  name: "integer",
  converter: ([value]) => {
    return stringToInteger(value);
  },
};

/**
 * Parameter type that parses the input value as JSON data.
 */
export const jsonParamType: CommandParamType<number> = {
  name: "json",
  converter: ([value]) => {
    return JSON.parse(value);
  },
};

/**
 * Parameter type that parses x, y and z entity coordinates.
 *
 * This parameter type supports relative coordinates prefixed with `~`. If you
 * intend to parse block coordinates, use {@link blockLocationParamType}
 * instead.
 */
export const locationParamType: CommandParamType<Location> = {
  name: "x y z",
  take: 3,
  converter: ([x, y, z]) => {
    return {
      x: stringToCoordinate(x, { blockCoordinates: false }),
      y: stringToCoordinate(y, { blockCoordinates: false }),
      z: stringToCoordinate(z, { blockCoordinates: false }),
    };
  },
};

/**
 * Parameter type that parses x, y and z block coordinates.
 *
 * This parameter type supports relative coordinates prefixed with `~`. If you
 * intend to parse entity coordinates, use {@link locationParamType} instead.
 */
export const blockLocationParamType: CommandParamType<
  Location
> = {
  name: "x y z",
  take: 3,
  converter: ([x, y, z]) => {
    return {
      x: stringToCoordinate(x, { blockCoordinates: true }),
      y: stringToCoordinate(y, { blockCoordinates: true }),
      z: stringToCoordinate(z, { blockCoordinates: true }),
    };
  },
};

function stringToFloat(value: string) {
  const n = +value;
  if (isNaN(n)) {
    throw new TypeError(`expected integer; got ${value}`);
  }
  return n;
}

interface StringToCoordinateOptions {
  /** Block coordinates require integers instead of floats. */
  blockCoordinates: boolean;
}

function stringToCoordinate(value: string, options: StringToCoordinateOptions) {
  const relativePrefix = "~";
  let relative = false;
  let numericValue = value;
  if (value.startsWith(relativePrefix)) {
    relative = true;
    numericValue = value.slice(relativePrefix.length);
  }

  let coord: number;
  if (options.blockCoordinates) {
    try {
      coord = stringToInteger(numericValue);
    } catch {
      throw new TypeError(`expected block coordinate; got ${value}`);
    }
  } else {
    try {
      coord = stringToFloat(numericValue);
    } catch {
      throw new TypeError(`expected coordinate; got ${value}`);
    }
  }
  return { coord, relative };
}

function stringToInteger(value: string) {
  const n = Number(value);
  if (!Number.isInteger(n)) {
    throw new TypeError(`expected integer; got ${value}`);
  }
  return n;
}

/**
 * A command request by a player after the input has been tokenized.
 *
 * This mean that quoted strings for example are grouped as a single argument
 * even if it contains spaces.
 */
export interface CommandRequest {
  name: string;
  args: string[];
}

// TODO:Add config options like ordering of functions and which information
//      to include.
export class HelpCommand implements Command {
  readonly name = "help";
  readonly aliases = ["?"];
  readonly description = "Display help for all or a certain command";
  readonly optionalParameters = [{
    type: stringParamType,
    name: "command",
    description: "The command to display the help of",
  }];
  readonly examples = [
    {
      description: "Display help for all commands",
      args: [],
    },
    {
      description: "Display help for the help command",
      args: [this.name],
    },
  ];

  displayHelp(origin: CommandOrigin, ...args: CommandArgument[]) {
    // TODO: display description of params
    // TODO: just use += if rhs does not make use of markup
    const { client, bot } = origin;

    let commands;

    const commandName = args.shift() as string | undefined;
    if (commandName === undefined) {
      commands = bot.cmds.map(([cmd, _callback]) => cmd);
    } else {
      const [cmd, _callback] = bot.searchCommand(commandName) ?? (() => {
        throw Error(`no such command ${commandName}`);
      })();
      commands = [cmd];
    }

    for (const cmd of commands) {
      let message =
        style`<materialDiamond>${bot.commandPrefix}${cmd.name}</materialDiamond>`;
      for (const mandatoryParam of cmd.mandatoryParameters ?? []) {
        message = styleWithOptions({
          stripCodes: false,
        })`${message} &lt;${mandatoryParam.name}: ${mandatoryParam.type.name}&gt;`;
      }
      for (const optionalParam of cmd.optionalParameters ?? []) {
        message = styleWithOptions({
          stripCodes: false,
        })`${message} [${optionalParam.name}: ${optionalParam.type.name}`;
        let defaultDisplay = "";
        if (optionalParam.default !== undefined) {
          if ("raw" in optionalParam.default) {
            defaultDisplay += ` = ${
              optionalParam.default.raw.map(shlex.quote).join(" ")
            }`;
          } else if (
            "representation" in optionalParam.default &&
            optionalParam.default.representation !== undefined
          ) {
            defaultDisplay += ` = ${optionalParam.default.representation}`;
          } else if ("value" in optionalParam.default) {
            defaultDisplay += ` = ${optionalParam.default.value}`;
          }
        }
        message += `${defaultDisplay}]`;
      }
      if ((cmd.aliases ?? []).length > 0) {
        message = styleWithOptions({
          stripCodes: false,
        })`${message}\n(aliases: <materialDiamond>${
          cmd.aliases![0]
        }</materialDiamond>`;
        for (const alias of cmd.aliases!.slice(1)) {
          message = styleWithOptions({
            stripCodes: false,
          })`${message}, <materialDiamond>${alias}</materialDiamond>`;
        }
        message = styleWithOptions({ stripCodes: false })`${message})`;
      }

      if (cmd.description !== null) {
        message = styleWithOptions({
          stripCodes: false,
        })`${message}\n${cmd.description}`;
      }

      const hasExamples = cmd.examples?.length ?? 0 > 0;
      if (hasExamples) {
        message = styleWithOptions({ stripCodes: false })`${message}\n\n  <materialCopper><bold>Examples</materialCopper></bold>\n`
      }
      for (const example of cmd.examples ?? []) {
        // TODO: syntax highlighting for args
        message = styleWithOptions({
          stripCodes: false,
        })`${message}  <materialCopper>${example.description}</materialCopper>\n  ${bot.commandPrefix}${cmd.name} ${
          example.args.join(" ")
        }`;
      }
      if (hasExamples) {
        message += "\n\n";
      }

      for (const line of message.split("\n")) {
        client.sendMessage(`${line}\n`);
      }
    }
  }
}
