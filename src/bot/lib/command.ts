import type { Client } from "@bedrock-ws/bedrockws";

export interface Command {
  name: string;
  description: string;
  mendatoryParameters?: CommandParameter[];
  optionalParameters?: CommandParameter[];
  examples?: CommandUsageExample[];
}

export interface CommandUsageExample {
  description: string;
  args: string[];
}

export enum CommandParamType {
  Boolean = "Boolean",
  Float = "Float",
  Integer = "Integer",
  Json = "Json",
  Location = "Location",
  String = "String",
}

export interface Location {
  x: { coord: number, relative: boolean },
  y: { coord: number, relative: boolean },
  z: { coord: number, relative: boolean },
}

export type CommandArgument = (string | number | boolean | undefined | Location)

export type CommandCallback = (origin: CommandOrigin, ...args: CommandArgument[]) => void;

export interface CommandOrigin {
  /** The player name of the player who triggered the command. */
  readonly initiator: string;

  /** The client that received the command. */
  readonly client: Client;
}

export interface CommandParameter {
  type: CommandParamType;
  name: string;
}

export interface CommandRequest {
  name: string;
  args: string[];
}
