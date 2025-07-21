import { EventEmitter } from "node:events";
import type { Event, GameEvent } from "./events.ts";
import { ConnectEvent, ReadyEvent } from "./events.ts";
import Client from "./Client.ts";
import { format } from "@std/datetime";
import { WebSocketServer } from "ws";
import type { Request } from "@bedrock-ws/bedrockws";

export interface LaunchOptions {
  port: number;
  hostname: string;
}

export default class Server extends EventEmitter {
  /** Every client connected to the server. */
  protected clients: Client[];

  /** Events that should be subscribed to as soon as a connection is established. */
  protected pendingSubscriptions: Set<keyof GameEvent> = new Set();

  constructor() {
    super();
    this.clients = [];
  }

  /** Launches the server. */
  launch(options: LaunchOptions) {
    const wss = new WebSocketServer({ ...options });
    wss.on("connection", (socket, _request) => {
      const client = new Client(socket, this);
      this.clients.push(client);

      for (const eventName of this.pendingSubscriptions) {
        client.subscribe(eventName);
      }
      this.emit(
        "Connect",
        new ConnectEvent({ server: this, client }),
      );

      socket.on("close", (event) => {
        console.debug(event);
        this.emit("Disconnect");
      });

      socket.on("error", (event) => {
        // TODO
        console.error(event);
      });

      socket.on("message", (message) => {
        const data = JSON.parse(message.toString());
        console.debug(data);
        {
          // TODO: used for debugging; remove this and also the datetime dep
          const logDir = `${Deno.env.get("HOME")}/.cache/bedrockws-deno`;
          const now = new Date();
          Deno.writeTextFileSync(
            `${logDir}/${format(now, "yyyy-MM-dd_HH-mm-ss_SSS.log")}`,
            JSON.stringify(data, null, 2),
          );
        }
        client.receive(data);
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
