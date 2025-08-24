import type { Client } from "@bedrock-ws/bedrockws";
import type { Bot } from "@bedrock-ws/bot";
import { style, styleWithOptions } from "@bedrock-ws/ui";
import { TypeError } from "./errors.ts";

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
  mandatoryParameters?: CommandParameter<unknown>[];

  /**
   * Optional parameters of the command.
   *
   * These will be appended to the mandatory parameters.
   */
  optionalParameters?: CommandParameter<unknown>[];

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
}

export const stringParamType: CommandParamType<string> = {
  name: "string",
  converter: ([value]) => value,
};

export const booleanParamType: CommandParamType<boolean> = {
  name: "boolean",
  converter: ([value]) => {
    if (value === "true") return true;
    if (value === "false") return false;
    throw new TypeError(`expected boolean; got ${value}`);
  },
};

export const floatParamType: CommandParamType<number> = {
  name: "float",
  converter: ([value]) => {
    return stringToFloat(value);
  },
};

export const integerParamType: CommandParamType<number> = {
  name: "integer",
  converter: ([value]) => {
    return stringToInteger(value);
  },
};

export const jsonParamType: CommandParamType<number> = {
  name: "json",
  converter: ([value]) => {
    return JSON.parse(value);
  },
};

export const locationParamType: CommandParamType<[number, number, number]> = {
  name: "x y z",
  take: 3,
  converter: ([x, y, z]) => {
    return [
      stringToFloat(x),
      stringToFloat(y),
      stringToFloat(z),
    ];
  },
};

export const blockLocationParamType: CommandParamType<
  [number, number, number]
> = {
  name: "x y z",
  take: 3,
  converter: ([x, y, z]) => {
    return [
      stringToInteger(x),
      stringToInteger(y),
      stringToInteger(z),
    ];
  },
};

function stringToFloat(value: string) {
  const n = +value;
  if (isNaN(n)) {
    throw new TypeError(`expected integer; got ${n}`);
  }
  return n;
}

function stringToInteger(value: string) {
  const n = Number(value);
  if (!Number.isInteger(n)) {
    throw new TypeError(`expected integer; got ${n}`);
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
        })`${message} [${optionalParam.name}: ${optionalParam.type.name}]`;
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
      for (const example of cmd.examples ?? []) {
        // TODO: syntax highlighting for args
        message = styleWithOptions({
          stripCodes: false,
        })`${message}\n\n  <materialCopper>${example.description}</materialCopper>\n  ${bot.commandPrefix}${cmd.name} ${
          example.args.join(" ")
        }`;
      }
      if (cmd.examples?.length ?? 0 > 0) {
        message += "\n\n";
      }

      client.sendMessage(message);
    }
  }
}
