import type {
  CommandArgument,
  CommandRequest,
  MandatoryCommandParameter,
  OptionalCommandParameter,
} from "./command.ts";
import {
  MissingArgumentError,
  PartialArgumentError,
  TooManyArgumentsError,
} from "./errors.ts";
import * as shlex from "shlex";

export function lexCommandInput(input: string): CommandRequest {
  const [name, ...args] = shlex.split(input);
  if (name === undefined) throw new SyntaxError("no command name provided");
  return { name, args };
}

export function parseCommand(
  mendatoryParams: readonly MandatoryCommandParameter<unknown>[],
  optionalParams: readonly OptionalCommandParameter<unknown>[],
  args: string[],
): CommandArgument[] {
  const amountOfArgs = args.length;
  const params = mendatoryParams.concat(optionalParams);
  const result: CommandArgument[] = [];
  paramIter: for (const [index, param] of params.entries()) {
    const take = param.type.take ?? 1;
    const localArgs: string[] = [];
    for (let i = 0; i < take; i++) {
      const arg = args.shift();

      if (arg !== undefined) {
        localArgs.push(arg);
        continue;
      }

      if (index + 1 <= mendatoryParams.length) {
        throw new MissingArgumentError(`missing argument for ${param.name}`);
      }
      if (args.length > 0) {
        throw new PartialArgumentError(
          `argument for ${param.name} only partially provided`,
        );
      }
      const paramDefault = (param as OptionalCommandParameter<unknown>).default;

      if (paramDefault === undefined) {
        result.push(undefined);
        continue paramIter;
      } else if ("raw" in paramDefault) {
        localArgs.push(...paramDefault.raw);
        break;
      } else if ("value" in paramDefault) {
        result.push(paramDefault.value);
        continue paramIter;
      } else if ("factory" in paramDefault) {
        result.push(paramDefault.factory());
        continue paramIter;
      }

      // Ensure we exhaustively matched every variant of the parameter default.
      const _: never = paramDefault;
    }

    const convertedArg = param.type.converter(localArgs);
    result.push(convertedArg);
  }
  if (args.length > 0) {
    throw new TooManyArgumentsError(
      `too many arguments; expected ${
        mendatoryParams.length + optionalParams.length
      } arguments, got ${amountOfArgs}`,
    );
  }
  return result;
}
