import {
  type CommandArgument,
  type CommandParameter,
  CommandParamType,
  type CommandRequest,
} from "./command.ts";
import { MissingArgumentError, TypeError, TooManyArgumentsError } from "./errors.ts";
import * as shlex from "shlex";

export function lexCommandInput(input: string): CommandRequest {
  const [name, ...args] = shlex.split(input);
  if (name === undefined) throw new SyntaxError("no command name provided");
  return { name, args };
}

function parseBoolean(value: string): boolean {
  if (value === "true") return true;
  if (value === "false") return false;
  throw new TypeError(`expected boolean; got ${value}`);
}

export function parseCommand(
  mendatoryParams: readonly CommandParameter[],
  optionalParams: readonly CommandParameter[],
  args: string[],
) {
  const amountOfArgs = args.length;
  const params = mendatoryParams.concat(optionalParams);
  const result: CommandArgument[] = [];
  for (const [index, param] of params.entries()) {
    const arg = args.shift();
    if (arg === undefined) {
      if (index + 1 < mendatoryParams.length) {
        throw new MissingArgumentError(`missing argument for ${param.name}`);
      }
      result.push(undefined);
      continue;
    }

    switch (param.type) {
      case CommandParamType.Boolean:
        result.push(parseBoolean(arg));
        break;
      case CommandParamType.Float:
        result.push(42); // TODO: parseInt(), parseFloat(), Number() suck
        break;
      case CommandParamType.Integer:
        result.push(42); // TODO: see above
        break;
      case CommandParamType.Json:
        result.push(""); // TODO
        break;
      case CommandParamType.Location:
        result.push(""); // TODO
        break;
      case CommandParamType.String:
        result.push(arg);
        break;
    }
  }
  if (args.length > 0) {
    throw new TooManyArgumentsError(`too many arguments; expected ${mendatoryParams.length + optionalParams.length} arguments, got ${amountOfArgs}`)
  }
  return result;
}
