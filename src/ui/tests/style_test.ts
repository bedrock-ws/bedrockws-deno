import { assertEquals, assertThrows } from "@std/assert";
import { render, type RenderOptions, style } from "@bedrock-ws/ui";

Deno.test("basic text", () => {
  assertEquals(style`Hello World`, "Hello World§r");
});

Deno.test("pre-sanitized", () => {
  assertEquals(render("<red>A<bold>B</bold>C</red>"), "§cA§lB§r§cC§r");
});

Deno.test("one color", () => {
  assertEquals(style`<red>Hello World</red>`, "§cHello World§r");
});

Deno.test("nested styling", () => {
  assertEquals(style`<red>A<bold>B</bold>C</red>`, "§cA§lB§r§cC§r");
});

Deno.test("deeply nested styling", () => {
  assertEquals(
    style`A<red>B<bold>C<italic>D</italic>E</bold>F</red>G`,
    "A§cB§lC§oD§r§c§lE§r§cF§rG§r",
  );
});

Deno.test("space within element", () => {
  assertEquals(style`<red>  Hello  </red>`, "§c  Hello  §r");
});

Deno.test("comment", () => {
  assertEquals(style`a<!-- this is a comment -->b`, "ab§r");
});

Deno.test("reset node", () => {
  assertEquals(style`<red>A<reset>B</reset>C</red>`, "§cA§rB§r§cC§r");
});

Deno.test("invalid style", () => {
  assertEquals(style`<blah>A</blah>`, "A§r");
});

Deno.test("overlap", () => {
  assertThrows(() => {
    style`<red>A<bold>B</red>C</bold>`;
  });
});

Deno.test("different casing", () => {
  assertEquals(style`<rED>A</rED>`, "§cA§r");
});

Deno.test("injection", () => {
  assertEquals(style`${"<red>"}A${"</red>"}`, "<red>A</red>§r");
});

Deno.test("multiple instances", () => {
  assertEquals(style`<red>A</red>B<red>C</red>`, "§cA§rB§cC§r");
});

Deno.test("text outside text tag", () => {
  const options: RenderOptions = { requireTextWithinTags: true };
  assertThrows(() => render("Hello World", options));
  assertThrows(() => render("Hello <t>World</t>", options));
  assertThrows(() => render("<t>Hello</t> World", options));
});

Deno.test("text within text tag", () => {
  const options: RenderOptions = { requireTextWithinTags: true };
  assertEquals(render("<t>Hello</t> <t>World</t>", options), "HelloWorld§r");
  assertEquals(
    render("<t>Hello</t>\n \t<t>World</t>", options),
    "HelloWorld§r",
  );
});

Deno.test("line break tag", () => {
  assertEquals(render("Hello<br />World"), "Hello\nWorld§r");
});
