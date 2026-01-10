import { assertEquals, assertThrows } from "@std/assert";
import { blockLocationParamType } from "../lib/command.ts";
import { parseCommand } from "../lib/parser.ts";
import {
  booleanParamType,
  jsonParamType,
  type Location,
  locationParamType,
  stringParamType,
  TypeError,
} from "@bedrock-ws/bot";
import { assertInstanceOf } from "@std/assert/instance-of";

Deno.test("string", () => {
  const input = ["Hello World"];
  const args = parseCommand(
    [{ name: "foo", type: stringParamType }],
    [],
    input,
  );
  assertEquals(args, ["Hello World"]);
});

Deno.test("block location", () => {
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

Deno.test("entity location", () => {
  {
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
  }
  {
    const input = ["a", "b", "c"];
    const error = assertThrows(() =>
      parseCommand([{ name: "foo", type: locationParamType }], [], input)
    );
    assertInstanceOf(error, TypeError);
  }
});

Deno.test("boolean", () => {
  {
    const input = ["true"];
    const args = parseCommand(
      [{ name: "foo", type: booleanParamType }],
      [],
      input,
    );
    assertEquals(args, [true]);
  }
  {
    const input = ["false"];
    const args = parseCommand(
      [{ name: "foo", type: booleanParamType }],
      [],
      input,
    );
    assertEquals(args, [false]);
  }
  {
    const input = ["TRUE"];
    const error = assertThrows(() =>
      parseCommand(
        [{ name: "foo", type: booleanParamType }],
        [],
        input,
      )
    );
    assertInstanceOf(error, TypeError);
  }
});

Deno.test("JSON", () => {
  const values = [[], {}, "Hello", null, true, false];
  for (const value of values) {
    const input = [JSON.stringify(value)];
    const args = parseCommand([{name: "foo", type: jsonParamType}], [], input);
    assertEquals(args, [value]);
  }
})

// TODO: etc...
