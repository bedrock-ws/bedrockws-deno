import { assertEquals, assertThrows } from "@std/assert";
import { blockLocationParamType } from "../lib/command.ts";
import { lexCommandInput, parseCommand } from "../lib/parser.ts";
import {
  booleanParamType,
  floatParamType,
  jsonParamType,
  type Location,
  locationParamType,
  stringParamType,
  TypeError,
  SyntaxError,
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
  })
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
