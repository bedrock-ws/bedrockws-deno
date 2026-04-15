import { assertEquals, assertThrows } from "@std/assert";
import {
  blockLocationParamType,
  OptionalCommandParameter,
} from "../lib/command.ts";
import { lexCommandInput, parseCommand } from "../lib/parser.ts";
import {
  booleanParamType,
  type CommandParameter,
  floatParamType,
  integerParamType,
  jsonParamType,
  type Location,
  locationParamType,
  MissingArgumentError,
  PartialArgumentError,
  stringParamType,
  SyntaxError,
  TooManyArgumentsError,
  TypeError,
} from "@bedrock-ws/bot";
import { assertInstanceOf } from "@std/assert/instance-of";

Deno.test("lexer", async (t) => {
  await t.step("only command", () => {
    const deserialized = lexCommandInput("foo");
    assertEquals(deserialized, {
      name: "foo",
      args: [],
    });
  });

  await t.step("simple arguments", () => {
    const deserialized = lexCommandInput("foo bar baz boo");
    assertEquals(deserialized, {
      name: "foo",
      args: ["bar", "baz", "boo"],
    });
  });

  await t.step("quoted arguments", () => {
    const deserialized = lexCommandInput("foo 'Hello World' \"Bye World\"");
    assertEquals(deserialized, {
      name: "foo",
      args: ["Hello World", "Bye World"],
    });
  });

  await t.step("quoted command", () => {
    const deserialized = lexCommandInput("'avoid this' bar baz");
    assertEquals(deserialized, {
      name: "avoid this",
      args: ["bar", "baz"],
    });
  });

  await t.step("including a literal quote", () => {
    const deserialized = lexCommandInput(`i 'can'"'"'t'`);
    assertEquals(deserialized, {
      name: "i",
      args: ["can't"],
    });
  });

  await t.step("empty input", () => {
    const error = assertThrows(() => lexCommandInput(""));
    assertInstanceOf(error, SyntaxError);
  });
});

Deno.test("default value", () => {
  const mandatoryParameters: CommandParameter<never>[] = [];
  const optionalParameters: OptionalCommandParameter<number>[] = [
    { name: "value", type: integerParamType, default: { value: 1 } },
    {
      name: "callback",
      type: integerParamType,
      default: { factory: () => 2 },
    },
    { name: "raw", type: integerParamType, default: { raw: ["3"] } },
    { name: "none", type: integerParamType },
  ];
  const args: string[] = [];
  const values = parseCommand(mandatoryParameters, optionalParameters, args);
  assertEquals(values, [1, 2, 3, undefined]);
});

Deno.test("argument amount mismatch", async (t) => {
  const mandatoryParameters = [
    { name: "a", type: stringParamType },
    { name: "b", type: stringParamType },
  ];
  const optionalParameters: CommandParameter<never>[] = [];

  await t.step("too many", () => {
    const args = ["A", "B", "C"];
    const error = assertThrows(() =>
      parseCommand(mandatoryParameters, optionalParameters, args)
    );
    assertInstanceOf(error, TooManyArgumentsError);
  });

  await t.step("too few", () => {
    const args = ["A"];
    const error = assertThrows(() =>
      parseCommand(mandatoryParameters, optionalParameters, args)
    );
    assertInstanceOf(error, MissingArgumentError);
  });

  await t.step("only partially provided", async (t) => {
    await t.step("mandatory parameter", () => {
      const mandatoryParameters: CommandParameter<never>[] = [];
      const optionalParameters = [{
        name: "a",
        type: blockLocationParamType,
      }];
      const args = ["1", "2"];
      const error = assertThrows(() =>
        parseCommand(mandatoryParameters, optionalParameters, args)
      );
      assertInstanceOf(error, PartialArgumentError);
    });
    await t.step("optional parameter", () => {
      const mandatoryParameters = [{
        name: "a",
        type: blockLocationParamType,
      }];
      const optionalParameters: CommandParameter<never>[] = [];
      const args = ["1", "2"];
      const error = assertThrows(() =>
        parseCommand(mandatoryParameters, optionalParameters, args)
      );
      assertInstanceOf(error, PartialArgumentError);
    });
  });
});

Deno.test("string", () => {
  const input = ["Hello World"];
  const args = parseCommand(
    [{ name: "foo", type: stringParamType }],
    [],
    input,
  );
  assertEquals(args, ["Hello World"]);
});

Deno.test("block location", async (t) => {
  await t.step("everything mixed", () => {
    const input = ["12", "~9", "-1"];
    const args = parseCommand(
      [{ name: "foo", type: blockLocationParamType }],
      [],
      input,
    );
    assertEquals(
      args,
      [
        {
          x: { coord: 12, relative: false },
          y: { coord: 9, relative: true },
          z: { coord: -1, relative: false },
        } satisfies Location,
      ],
    );
  });

  await t.step("two negations", () => {
    const input = ["--1", "0", "0"];
    const error = assertThrows(() =>
      parseCommand(
        [{ name: "foo", type: blockLocationParamType }],
        [],
        input,
      )
    );
    assertInstanceOf(error, TypeError);
  });

  await t.step("floating point coordinates", () => {
    const input = ["12.6", "~9.3", "-1.1"];
    const error = assertThrows(() =>
      parseCommand(
        [{ name: "foo", type: blockLocationParamType }],
        [],
        input,
      )
    );
    assertInstanceOf(error, TypeError);
  });

  await t.step("non-numeric coordinates", () => {
    const input = ["a", "b", "c"];
    const error = assertThrows(() =>
      parseCommand(
        [{ name: "foo", type: blockLocationParamType }],
        [],
        input,
      )
    );
    assertInstanceOf(error, TypeError);
  });
});

Deno.test("entity location", async (t) => {
  await t.step("everything mixed", () => {
    const input = ["42.3", "~-1.2", "0"];
    const args = parseCommand(
      [{ name: "foo", type: locationParamType }],
      [],
      input,
    );
    assertEquals(
      args,
      [
        {
          x: { coord: 42.3, relative: false },
          y: { coord: -1.2, relative: true },
          z: { coord: 0, relative: false },
        } satisfies Location,
      ],
    );
  });

  await t.step("non-numeric coordinates", () => {
    const input = ["a", "b", "c"];
    const error = assertThrows(() =>
      parseCommand([{ name: "foo", type: locationParamType }], [], input)
    );
    assertInstanceOf(error, TypeError);
  });
});

Deno.test("boolean", async (t) => {
  await t.step("true input", () => {
    const input = ["true"];
    const args = parseCommand(
      [{ name: "foo", type: booleanParamType }],
      [],
      input,
    );
    assertEquals(args, [true]);
  });

  await t.step("false input", () => {
    const input = ["false"];
    const args = parseCommand(
      [{ name: "foo", type: booleanParamType }],
      [],
      input,
    );
    assertEquals(args, [false]);
  });

  await t.step("non-boolean input", () => {
    const input = ["TRUE"];
    const error = assertThrows(() =>
      parseCommand(
        [{ name: "foo", type: booleanParamType }],
        [],
        input,
      )
    );
    assertInstanceOf(error, TypeError);
  });
});

Deno.test("JSON", () => {
  const values = [[], {}, "Hello", null, true, false];
  for (const value of values) {
    const input = [JSON.stringify(value)];
    const args = parseCommand(
      [{ name: "foo", type: jsonParamType }],
      [],
      input,
    );
    assertEquals(args, [value]);
  }
});

Deno.test("float", () => {
  const value = 42.1010100;
  const input = [value.toString()];
  const args = parseCommand(
    [{ name: "foo", type: floatParamType }],
    [],
    input,
  );
  assertEquals(args, [value]);
});

Deno.test("integer", () => {
  const value = 42;
  const input = [value.toString()];
  const args = parseCommand(
    [{ name: "foo", type: integerParamType }],
    [],
    input,
  );
  assertEquals(args, [value]);
});
