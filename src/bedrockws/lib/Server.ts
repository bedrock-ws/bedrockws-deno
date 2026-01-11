import { EventEmitter } from "node:events";
import * as os from "node:os";
import type { Event, GameEvent } from "./events.ts";
import { ConnectEvent, DisconnectEvent, ReadyEvent } from "./events.ts";
import Client from "./Client.ts";
import { WebSocketServer } from "ws";
import { type Request, Response } from "./mod.ts";
import * as path from "@std/path";
import * as datetime from "@std/datetime";

export interface LaunchOptions {
  port: number;
  hostname: string;
}

export default class Server extends EventEmitter {
  /** Every client connected to the server. */
  readonly clients: Client[];

  protected wss: WebSocketServer | undefined;

  /** Events that should be subscribed to as soon as a connection is established. */
  protected pendingSubscriptions: Set<keyof GameEvent> = new Set();

  constructor() {
    super();
    this.clients = [];
  }

  /**
   * Closes the server.
   *
   * This has no effect when the server is not running.
   */
  close() {
    this.wss?.close();
  }

  /** Launches the server. */
  launch(options: LaunchOptions) {
    this.wss = new WebSocketServer({ ...options });
    this.wss.on("connection", (socket, _request) => {
      const client = new Client(socket, this);
      this.clients.push(client);

      for (const eventName of this.pendingSubscriptions) {
        client.subscribe(eventName);
      }
      this.emit(
        "Connect",
        new ConnectEvent({ server: this, client }),
      );

      socket.on("close", (code) => {
        console.debug({ code });
        this.emit(
          "Disconnect",
          new DisconnectEvent({ server: this, client, code }),
        );
      });

      socket.on("error", (event) => {
        // TODO
        console.error(event);
      });

      socket.on("message", (message) => {
        const data = JSON.parse(message.toString());
        if (Deno.env.get("BEDROCKWS_DENO_TELEMETRY") === "1") {
          logResponse(data);
        }
        const response = new Response(data);
        client.receive(response);
      });
    });
    this.emit(
      "Ready",
      new ReadyEvent({
        server: this,
        hostname: options.hostname,
        port: options.port,
      }),
    );
  }

  /** Sends a request to each Minecraft client. */
  async send(req: Request): Promise<void> {
    for (const client of this.clients) {
      await client.send(req);
    }
  }

  override on<K extends keyof Event>(
    eventName: K,
    eventHandler: Event[K],
  ): this {
    if (
      eventName !== "Ready" && eventName !== "Connect" &&
      eventName !== "Disconnect"
    ) {
      this.pendingSubscriptions.add(eventName);
    }
    return super.on(eventName, eventHandler);
  }
}

function logResponse(data: object) {
  const logDir = path.join(os.homedir(), ".cache/bedrockws-deno");
  Deno.mkdirSync(logDir, { recursive: true });
  const now = new Date();
  Deno.writeTextFileSync(
    path.join(
      logDir,
      `${datetime.format(now, "yyyy-MM-dd_HH-mm-ss_SSS")}.log.json`,
    ),
    JSON.stringify(data, null, 2),
  );
}
