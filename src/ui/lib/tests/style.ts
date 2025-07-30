import { assertEquals, assertThrows } from "jsr:@std/assert";
import { style } from "@bedrock-ws/ui";

Deno.test("basic text", () => {
  assertEquals(style`Hello World`, "Hello World");
});

Deno.test("one color", () => {
  assertEquals(style`<red>Hello World</red>`, "§cHello World§r");
});

Deno.test("nested styling", () => {
  assertEquals(style`<red>A<bold>B</bold>C</red>`, "§cA§lB§r§cC§r");
});

Deno.test("overlap", () => {
  assertThrows(() => {
    style`<red>A<bold>B</red>C</bold>`;
  });
});
