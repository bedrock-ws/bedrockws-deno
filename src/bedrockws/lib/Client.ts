import { Semaphore } from "@asyncio/sync/semaphore";
import * as consts from "./consts.ts";
import type { GameEvent } from "./events.ts";
import { PlayerMessageEvent, PlayerTeleportedEvent } from "./events.ts";
import type { Request, Response, Server } from "@bedrock-ws/bedrockws";
import type { WebSocket } from "ws";
import type { RawText } from "@minecraft/server";
import type * as event from "@bedrock-ws/schema/events";
import type { z } from "zod/v4";

interface PendingRequest<O, E> {
  resolve: (value: O) => void;
  reject: (reason: E) => void;
}

/** Representation of a Minecraft client connected to the WebSocket server. */
export default class Client {
  /** The WebSocket connection with the server. */
  protected socket: WebSocket;

  /** The associated server. */
  server: Server;

  /**
   * The requests IDs of those sent to the Minecraft client that need to be
   * answered by it.
   */
  protected requests: Map<string, PendingRequest<Response, Response>>;

  /**
   * A sempahore which holds pending command requests to the Minecraft client.
   */
  protected commandSemaphore: Semaphore;

  constructor(socket: WebSocket, server: Server) {
    this.socket = socket;
    this.server = server;
    this.requests = new Map();
    this.commandSemaphore = new Semaphore(
      consts.maxCommandProcessing,
    );
  }

  /** Sends a request to the Minecraft client. */
  async send(req: Request): Promise<Response> {
    const requestId = req.header.requestId;

    // Send the request as soon as the queue has enough space.
    await this.commandSemaphore.acquire();
    const data = JSON.stringify(req);
    console.debug(data);
    this.socket.send(data);

    return new Promise((resolve, reject) => {
      this.requests.set(requestId, { resolve, reject });
    });
  }

  sendMessage(message: RawText | string, target: string = "@a") {
    const rawText: RawText = typeof message === "string"
      ? { rawtext: [{ text: message }] }
      : message;
    this.run(`tellraw ${target} ${JSON.stringify(rawText)}`);
  }

  /** Handles a response from the Minecraft client. */
  receive(res: Response) {
    const requestId = (res.header.messagePurpose === "commandResponse")
      ? res.header.requestId
      : undefined;
    const isError = res.header.messagePurpose === "error";
    const isResponse = res.header.messagePurpose === "commandResponse";
    if (isResponse && requestId !== undefined) {
      this.commandSemaphore.release();
      const maybeRequest = this.requests.get(requestId);
      if (maybeRequest !== undefined) {
        const { resolve, reject } = maybeRequest;
        if (isError) {
          reject(res);
        } else {
          resolve(res);
        }
      }
    }

    if (res.header.messagePurpose !== "event") return;

    const eventName = res.header.eventName;

    switch (eventName) {
      case "PlayerMessage": {
        const ev = new PlayerMessageEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.PlayerMessage>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      default:
        throw eventName satisfies never;
    }
    // TODO: ...
  }

  /** Runs a command as the Minecraft client. */
  async run(command: string): Promise<Response> {
    const identifier = crypto.randomUUID();
    return await this.send({
      header: {
        version: 1,
        requestId: identifier,
        messageType: "commandRequest",
        messagePurpose: "commandRequest",
      },
      body: {
        // TODO: verion property
        commandLine: command,
        origin: {
          type: "player",
        },
      },
    });
  }

  /** Subscribes to a client's event. */
  async subscribe(eventName: keyof GameEvent): Promise<Response> {
    const identifier = crypto.randomUUID();
    const res = await this.send({
      header: {
        version: 1,
        requestId: identifier,
        messageType: "commandRequest",
        messagePurpose: "subscribe",
      },
      body: {
        eventName: eventName,
      },
    });
    return res;
  }
}
