import type Request from "./Request.ts";
import { EventEmitter } from "node:events";
import type { Event, GameEvent } from "./events.ts";
import { ConnectEvent, ReadyEvent } from "./events.ts";
import Client from "./Client.ts";
import { format } from "@std/datetime";

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
    // TODO: Deno.serve logs a message, perhaps set onListen to override that behavior
    Deno.serve(
      { ...options },
      (request) => {
        if (request.headers.get("upgrade") != "websocket") {
          return new Response(null, { status: 501 });
        }

        const { socket, response } = Deno.upgradeWebSocket(request);
        // TODO: maybe check if `response` is an error perhaps?

        const client = new Client(socket, this);
        this.clients.push(client);

        socket.addEventListener("open", () => {
          for (const eventName of this.pendingSubscriptions) {
            client.subscribe(eventName);
          }
          this.emit(
            "connect",
            new ConnectEvent({ server: this, client }),
          );
        });

        socket.addEventListener("close", (event) => {
          console.debug(event);
          this.emit("disconnect");
        });

        socket.addEventListener("error", (event) => {
          // TODO
          console.error(event);
        });

        socket.addEventListener("message", (event) => {
          const data = JSON.parse(event.data);
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

        return response;
      },
    );
    this.emit(
      "ready",
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
      eventName !== "ready" && eventName !== "connect" &&
      eventName !== "disconnect"
    ) {
      this.pendingSubscriptions.add(eventName);
    }
    return super.on(eventName, eventHandler);
  }
}
