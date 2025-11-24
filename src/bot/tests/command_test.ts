import { assertEquals } from "@std/assert";
import {
  blockLocationParamType,
  type Command,
  integerParamType,
  stringParamType,
} from "@bedrock-ws/bot";
import { parseCommand } from "../lib/parser.ts";

Deno.test("zero parameters", () => {
  const cmd: Command = {
    name: "foo",
    mandatoryParameters: [],
    optionalParameters: [],
  };
  assertEquals(
    parseCommand(
      cmd.mandatoryParameters!,
      cmd.optionalParameters!,
      [],
    ),
    [],
  );
});

Deno.test("only mandatory parameters", () => {
  const cmd: Command = {
    name: "foo",
    mandatoryParameters: [
      {
        name: "a",
        type: stringParamType,
      },
      {
        name: "b",
        type: stringParamType,
      },
    ],
    optionalParameters: [],
  };
  assertEquals(
    parseCommand(
      cmd.mandatoryParameters!,
      cmd.optionalParameters!,
      ["one", "two"],
    ),
    ["one", "two"],
  );
});

Deno.test("optional parameter with default value", () => {
  const cmd: Command = {
    name: "foo",
    mandatoryParameters: [],
    optionalParameters: [
      {
        name: "a",
        type: integerParamType,
        default: { value: 42 },
      },
    ],
  };
  assertEquals(
    parseCommand(
      cmd.mandatoryParameters!,
      cmd.optionalParameters!,
      ["54"],
    ),
    [54],
  );
  assertEquals(
    parseCommand(
      cmd.mandatoryParameters!,
      cmd.optionalParameters!,
      [],
    ),
    [42],
  );
});

Deno.test("optional parameter with raw default value", () => {
  const cmd: Command = {
    name: "foo",
    mandatoryParameters: [],
    optionalParameters: [
      {
        name: "a",
        type: integerParamType,
        default: { raw: ["42"] },
      },
    ],
  };
  assertEquals(
    parseCommand(
      cmd.mandatoryParameters!,
      cmd.optionalParameters!,
      [],
    ),
    [42],
  );
});

Deno.test("optional parameter with default factory", () => {
  const cmd: Command = {
    name: "foo",
    mandatoryParameters: [],
    optionalParameters: [
      {
        name: "a",
        type: integerParamType,
        default: { factory: () => 42 },
      },
      {
        name: "b",
        type: blockLocationParamType,
        default: { raw: ["42", "69", "420"] },
      },
    ],
  };
  assertEquals(
    parseCommand(
      cmd.mandatoryParameters!,
      cmd.optionalParameters!,
      [],
    ),
    [42, [42, 69, 420]],
  );
});

Deno.test("parameter with variadic input", () => {
  const cmd: Command = {
    name: "foo",
    mandatoryParameters: [
      {
        name: "a",
        type: blockLocationParamType,
      },
    ],
    optionalParameters: [],
  };
  assertEquals(
    parseCommand(
      cmd.mandatoryParameters!,
      cmd.optionalParameters!,
      ["12", "33", "42"],
    ),
    [[12, 33, 42]],
  );
});
