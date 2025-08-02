import type { Client } from "@bedrock-ws/bedrockws";

export interface Command {
  /**
   * The name of the command.
   *
   * This must not be empty.
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
  mandatoryParameters?: CommandParameter[];

  /**
   * Optional parameters of the command.
   *
   * These will be appended to the mandatory parameters.
   */
  optionalParameters?: CommandParameter[];

  /**
   * Examples that explain usage of the command.
   */
  examples?: CommandUsageExample[];
}

export interface CommandUsageExample {
  description: string;
  args: string[];
}

export enum CommandParamType {
  /** `true` or `false`. */
  Boolean = "Boolean",
  Float = "Float",
  Integer = "Integer",
  Json = "Json",
  Location = "Location",
  String = "String",
}

export interface Location {
  x: { coord: number; relative: boolean };
  y: { coord: number; relative: boolean };
  z: { coord: number; relative: boolean };
}

export type CommandArgument = string | number | boolean | undefined | Location;

export type CommandCallback = (
  origin: CommandOrigin,
  ...args: CommandArgument[]
) => void;

export interface CommandOrigin {
  /** The player name of the player who triggered the command. */
  readonly initiator: string;

  /** The client that received the command. */
  readonly client: Client;
}

export interface CommandParameter {
  /** The type of the parameter. */
  type: CommandParamType;

  /** The name of the parameter. */
  name: string;
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

export class HelpCommand implements Command {
  readonly name = "help";
  readonly aliases = ["?"];
  readonly description = "Display help for all or a certain command";
  readonly optionalParameters = [{
    type: CommandParamType.String,
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
  private commands: Command[];

  constructor(commands: Command[] = []) {
    this.commands = commands;
  }
}
