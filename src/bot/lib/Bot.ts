import { type Client, consts, Server } from "@bedrock-ws/bedrockws";
import type { Command, CommandCallback, CommandOrigin } from "./command.ts";
import * as ui from "@bedrock-ws/ui";
import { lexCommandInput, parseCommand } from "./parser.ts";
import { UnknownCommandError } from "./errors.ts";

export interface BotOptions {
  commandPrefix: string;

  /**
   * Whether to whisper error messages to the player who tried to ran the
   * command or make the error message visible for everyone.
   */
  whisperErrors?: boolean;
}

export default class Bot extends Server {
  readonly commandPrefix: string;
  readonly whisperErrors: boolean;

  private commands: [Command, CommandCallback][];

  constructor(options: BotOptions) {
    super();

    this.commandPrefix = options.commandPrefix;
    this.whisperErrors = options.whisperErrors ?? false;

    this.commands = [];

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
      const cmd = this.commands.find((cmd) => cmd[0].name === name);
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
        cmd[0].mendatoryParameters ?? [],
        cmd[0].optionalParameters ?? [],
        args,
      );
      } catch (e) {
        this.displayError(client, data.sender, e as Error);
        return;
      }

      const origin: CommandOrigin = { initiator: data.sender, client };

      cmd[1](origin, ...parsedArgs);
    });
  }

  private displayError(client: Client, player: string, error: Error) {
    client.sendMessage(
      ui.style`<red><bold>${error.name}</bold>${error.message}`,
      this.whisperErrors ? player : "@a",
    );
  }

  /** Registers a new command. */
  cmd(command: Command, callback: CommandCallback) {
    if (this.commands.map((value) => value[0].name).includes(command.name)) {
      throw new Error(
        `command with name ${command.name} is already registered`,
      );
    }
    this.commands.push([command, callback]);
  }
}
