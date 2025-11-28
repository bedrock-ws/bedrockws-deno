import { assertEquals } from "@std/assert";
import { type Command, HelpCommand } from "../lib/command.ts";
import * as ui from "@bedrock-ws/ui";

const commandPrefix = "!";

Deno.test("only help command", async () => {
  const helpCommand = new HelpCommand();
  const actual = HelpCommand.renderHelp(HelpCommand.defaultTemplate(), [
    helpCommand,
  ], { commandPrefix });
  assertEquals(
    actual,
    ui.render(
      (await import("./expected_help_output/only_help_command.xml", {
        with: { type: "text" },
      })).default.trim(),
    ),
  );
});

Deno.test("single bare subcommand", async () => {
  const cmd: Command = { name: "foo" };
  const actual = HelpCommand.renderHelp(HelpCommand.defaultTemplate(), [cmd], {
    commandPrefix,
  });
  assertEquals(
    actual,
    ui.render(
      (await import("./expected_help_output/single_bare_subcommand.xml", {
        with: { type: "text" },
      })).default.trim(),
    ),
  );
});

Deno.test("unquoted example argument", async () => {
  const cmd: Command = {
    name: "Hello",
    examples: [{ description: "Greets John Doe", args: ["John Doe"] }],
  };
  const actual = HelpCommand.renderHelp(HelpCommand.defaultTemplate(), [cmd], {
    commandPrefix,
  });
  assertEquals(
    actual,
    ui.render(
      (await import("./expected_help_output/unquoted_example_argument.xml", {
        with: { type: "text" },
      })).default.trim(),
    ),
  );
});
