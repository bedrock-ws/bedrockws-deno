import type {
  CommandArgument,
  CommandParameter,
  CommandRequest,
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
  mendatoryParams: readonly CommandParameter<unknown>[],
  optionalParams: readonly CommandParameter<unknown>[],
  args: string[],
) {
  const amountOfArgs = args.length;
  const params = mendatoryParams.concat(optionalParams);
  const result: CommandArgument[] = [];
  paramIter: for (const [index, param] of params.entries()) {
    const take = param.type.take ?? 1;
    const localArgs: string[] = [];
    for (let i = 0; i < take; i++) {
      const arg = args.shift();
      if (arg === undefined) {
        if (index + 1 <= mendatoryParams.length) {
          throw new MissingArgumentError(`missing argument for ${param.name}`);
        }
        if (args.length > 0) {
          throw new PartialArgumentError(
            `argument for ${param.name} only partially provided`,
          );
        }
        result.push(undefined);
        continue paramIter;
      }
      localArgs.push(arg);
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
