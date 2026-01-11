import { type Client, consts, Server } from "@bedrock-ws/bedrockws";
import type { Command, CommandCallback, CommandOrigin } from "./command.ts";
import * as ui from "@bedrock-ws/ui";
import { lexCommandInput, parseCommand } from "./parser.ts";
import { UnknownCommandError } from "./errors.ts";
import { HelpCommand } from "@bedrock-ws/bot";

/**
 * Configuration options for the bot.
 */
export interface BotOptions {
  /**
   * The prefix required to invoke commands.
   *
   * The prefix can be of any length including zero. The prefix must not begin
   * with a slash (`/`).
   */
  commandPrefix: string;

  /**
   * Whether to whisper error messages to the player who tried to ran the
   * command or make the error message visible for everyone.
   *
   * This is `false` by default.
   */
  whisperErrors?: boolean;

  /**
   * Whether to automatically add a help command.
   *
   * This is `true` by default.
   */
  helpCommand?: boolean;

  // TODO: `flavor` option being either `"minecraft"` or `"command-line"` for
  //       Minecraft-style commands and command-line-style commands accordingly.
  //       Note that the `take` parameter of command parameter only makes sense
  //       for Minecraft-style commands. Also let user choose a prefix when
  //       using command-line-style commands (Unix uses `--`, Windows uses `/`).
}

/**
 * A bot is a WebSocket server that is capable of managing custom commands.
 */
export default class Bot extends Server {
  readonly commandPrefix: string;
  readonly whisperErrors: boolean;

  private commands: [Command, CommandCallback][];

  constructor(options: BotOptions) {
    super();

    this.commands = [];

    this.commandPrefix = options.commandPrefix;
    this.whisperErrors = options.whisperErrors ?? false;
    if (options.helpCommand ?? true) {
      const helpCommand = new HelpCommand();
      this.commands.push([helpCommand, helpCommand.runHelp.bind(helpCommand)]);
    }

    this.on("PlayerMessage", (event) => {
      const { client, data } = event;

      if ((Object.values(consts.names) as string[]).includes(data.sender)) {
        return;
      }
      if (event.receiver !== undefined) return;
      if (!data.message.startsWith(this.commandPrefix)) return;

      let name, args;
      try {
        ({ name, args } = lexCommandInput(
          data.message.slice(this.commandPrefix.length),
        ));
      } catch (e) {
        this.displayError(client, data.sender, e as Error);
        return;
      }
      const cmd = this.searchCommand(name);
      if (cmd === undefined) {
        this.displayError(
          client,
          event.data.sender,
          new UnknownCommandError(`unknown command ${name}`),
        );
        return;
      }

      let parsedArgs;
      try {
        parsedArgs = parseCommand(
          cmd[0].mandatoryParameters ?? [],
          cmd[0].optionalParameters ?? [],
          args,
        );
      } catch (e) {
        this.displayError(client, data.sender, e as Error);
        return;
      }

      const origin: CommandOrigin = {
        initiator: data.sender,
        event,
        client,
        bot: this,
      };

      try {
        cmd[1](origin, ...parsedArgs);
      } catch (e) {
        // FIXME: application code may throw different types than Error!
        this.displayError(client, data.sender, e as Error);
      }
    });
  }

  /** Read-only view of currently registered commands. */
  get cmds(): readonly [Command, CommandCallback][] {
    return this.commands;
  }

  private displayError(client: Client, player: string, error: Error): void {
    console.error({
      message: error.message,
      name: error.name,
      cause: error.cause,
      stack: error.stack,
    });
    client.sendMessage(
      ui.style`<red><bold>${error.name}</bold>: ${error.message}</red>`,
      { target: this.whisperErrors ? player : "@a" },
    );
  }

  /**
   * Registers a new command.
   *
   * This functions throws an error if a command with the same name already
   * exists.
   */
  cmd(command: Command, callback: CommandCallback): void {
    for (const name in [command.name, ...command.aliases ?? []]) {
      if (this.searchCommand(name)) {
        throw new Error(
          `command with name ${name} is already registered`,
        );
      }
    }
    this.commands.push([command, callback]);
  }

  /**
   * Removes a previously registered command.
   *
   * This function does nothing if there is no command with the supplied name.
   */
  removeCommand(commandName: string): void {
    for (let i = 0; i < this.commands.length; i++) {
      const cmd = this.commands[i][0];
      if ([cmd.name, ...cmd.aliases ?? []].includes(commandName)) {
        this.commands.splice(i, 1);
        break;
      }
    }
  }

  /**
   * Search for a command and its callback by its name or alias.
   */
  searchCommand(
    commandName: string,
  ): readonly [Command, CommandCallback] | undefined {
    for (const cmd of this.commands) {
      if ([cmd[0].name, ...cmd[0].aliases ?? []].includes(commandName)) {
        return cmd;
      }
    }
  }
}
