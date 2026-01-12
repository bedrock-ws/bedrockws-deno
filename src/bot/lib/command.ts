import type { Client } from "@bedrock-ws/bedrockws";
import type { Bot } from "@bedrock-ws/bot";
import * as ui from "@bedrock-ws/ui";
import { TypeError } from "./errors.ts";
import * as shlex from "shlex";
import Handlebars from "handlebars";
import type { PlayerMessageEvent } from "@bedrock-ws/bedrockws/events";
import { inspect } from "node:util";
// Use `{ type: "text" }` imports when they are stabilized.
import { default as helpTemplate } from "./help.hbs.ts";

/**
 * A command for a bot.
 *
 * Commands can be invoked used by players and perform some action.
 */
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

/**
 * A single example describing the usage of a command.
 */
export interface CommandUsageExample {
  description: string;
  args: string[];
}

/**
 * A type for a command parameter.
 *
 * A parameter type is responsible for consuming the raw input and converting
 * it to another structure.
 */
export interface CommandParamType<T> {
  /** The name to represent the type. */
  name: string;

  /**
   * The conversion of the raw input into another structure.
   */
  converter: (raw: string[]) => T;

  /**
   * The number of words this parameter type consumes.
   *
   * Most converters only take a single word. A parameter type like
   * {@link blockLocationParamType} for example accepts three words which
   * almost matches the way Minecraft commands parse coordinates. A parameter
   * type must take at least one word. By default it takes exactly one.
   */
  take?: number;
}

/**
 * The location of a block or entity in a Minecraft world.
 */
export interface Location {
  x: { coord: number; relative: boolean };
  y: { coord: number; relative: boolean };
  z: { coord: number; relative: boolean };
}

/**
 * The type of a parsed command argument.
 */
export type CommandArgument = unknown;

export type CommandCallback = (
  origin: CommandOrigin,
  ...args: CommandArgument[]
) => void;

export interface CommandOrigin {
  /** The player name of the player who triggered the command. */
  readonly initiator: string;

  /** The message event that triggered the command. */
  readonly event: PlayerMessageEvent;

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
  default?: CommandParameterDefault<T>;
}

export type CommandParameterDefault<T> =
  | CommandParameterDefaultRaw
  | CommandParameterDefaultValue<T>
  | CommandParameterDefaultFactory<T>;

interface CommandParameterDefaultWithOptionalRepresentation {
  /**
   * The textual representation of the default.
   *
   * This is useful when the default value is evaluated dynamically or the
   * textual representation of the default value is not as understandable.
   */
  representation?: string;
}

export interface CommandParameterDefaultFactory<T>
  extends CommandParameterDefaultWithOptionalRepresentation {
  /** A callback to evaluate the default value whenever it is needed. */
  factory: () => T;
}

export interface CommandParameterDefaultRaw {
  /** The raw default values passed onto the converter of the parameter type. */
  raw: string[];
}

export interface CommandParameterDefaultValue<T>
  extends CommandParameterDefaultWithOptionalRepresentation {
  /** The default value. */
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
    throw new TypeError(`expected boolean; got ${inspect(value)}`);
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
    throw new TypeError(`expected integer; got ${inspect(value)}`);
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
      throw new TypeError(`expected block coordinate; got ${inspect(value)}`);
    }
  } else {
    try {
      coord = stringToFloat(numericValue);
    } catch {
      throw new TypeError(`expected coordinate; got ${inspect(value)}`);
    }
  }
  return { coord, relative };
}

function stringToInteger(value: string) {
  const n = Number(value);
  if (!Number.isInteger(n)) {
    throw new TypeError(`expected integer; got ${inspect(value)}`);
  }
  return n;
}

/**
 * Fields provided to the help template.
 */
export interface RenderHelpOptions {
  /** The command prefix used by the bot. */
  commandPrefix: string;
}

/**
 * A command request by a player after the input has been tokenized.
 *
 * This mean that quoted strings for example are grouped as a single argument
 * even if it contains spaces.
 */
export interface CommandRequest {
  /** The name of the command. */
  name: string;

  /** Raw arguments provided by the player. */
  args: string[];
}

export interface HelpCommandOptions {
  /** The help template used to render the help message. */
  helpTemplate?: Handlebars.TemplateDelegate;
}

const helpCommandName = "help";

// TODO: Add config options like ordering of functions and which information
//       to include.
/**
 * A help command that displays help for other commands registered by the bot.
 */
export class HelpCommand implements Command {
  readonly name = helpCommandName;
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
      args: [helpCommandName],
    },
  ];
  private readonly helpTemplate: Handlebars.TemplateDelegate;

  constructor(options?: HelpCommandOptions) {
    const helpTemplate = options?.helpTemplate;
    if (helpTemplate === undefined) {
      this.helpTemplate = HelpCommand.defaultTemplate();
    } else {
      this.helpTemplate = helpTemplate;
    }
  }

  /**
   * Renders a help message from an array of commands.
   */
  static renderHelp(
    template: Handlebars.TemplateDelegate,
    commands: Command[],
    options: RenderHelpOptions,
  ): string {
    return ui.render(
      template({
        commands: commands.map((command) => {
          // replace undefined with empty arrays where it makes sense
          return {
            mandatoryParameters: command.mandatoryParameters ?? [],
            optionalParameters: command.optionalParameters ?? [],
            examples: command.examples ?? [],
            aliases: command.aliases ?? [],
            ...command,
          };
        }),
        commandPrefix: options.commandPrefix,
      }),
      { requireTextWithinTags: true },
    );
  }

  static defaultTemplate(): Handlebars.TemplateDelegate {
    const hbs = Handlebars.create();
    hbs.registerHelper("toString", (value) => value.toString());
    hbs.registerHelper("shlexQuote", shlex.quote);
    hbs.registerHelper(
      "concat",
      (...arrays: unknown[]): unknown =>
        Array.prototype.concat(...arrays.slice(0, -1)),
    );
    hbs.registerHelper(
      "defined",
      (value) => value !== undefined && value !== null,
    );
    return hbs.compile(helpTemplate, { strict: true });
  }

  /**
   * Runs the help command.
   */
  runHelp(origin: CommandOrigin, ...args: CommandArgument[]): void {
    const { event, bot } = origin;

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

    const message = HelpCommand.renderHelp(this.helpTemplate, commands, {
      commandPrefix: bot.commandPrefix,
    });

    event.reply(message);
  }
}
