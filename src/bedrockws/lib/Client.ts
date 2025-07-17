import { Semaphore } from "@asyncio/sync/semaphore";
import * as consts from "./consts.ts";
import type Request from "./Request.ts";
import type Response from "./Response.ts";
import type { Event } from "./events.ts";
import {
  AdditionalContentLoadedEvent,
  PlayerMessageEvent,
  PlayerTravelledEvent,
} from "./events.ts";
import type { Server } from "@bedrock-ws/bedrockws";
import type { WebSocket } from "ws";
import { eventNameAsCamelCase, eventNameAsPascalCase } from "./case.ts";

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

  /** Handles a response from the Minecraft client. */
  receive(res: Response) {
    const { requestId } = res.header;
    const isError = res.header.messagePurpose === "error";
    const isResponse = res.header.messagePurpose == "commandResponse";
    const eventName = res.header.eventName;
    if (isResponse) {
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

    // TODO: just use data: res.body
    switch (eventName) {
      case "AdditionalContentLoaded": {
        const event = new AdditionalContentLoadedEvent({
          server: this.server,
          client: this,
          data: {},
        });
        this.server.emit(eventNameAsCamelCase(eventName), event);
        break;
      }
      // TODO
      case "PlayerMessage": {
        const event = new PlayerMessageEvent({
          server: this.server,
          client: this,
          data: {
            sender: res.body.sender,
            type: res.body.type,
            message: res.body.message,
            receiver: res.body.receiver,
          },
        });
        this.server.emit(eventNameAsCamelCase(eventName), event);
        break;
      }
      case "PlayerTravelled": {
        const event = new PlayerTravelledEvent({
          server: this.server,
          client: this,
          data: res.body,
        });
        this.server.emit(eventNameAsCamelCase(eventName), event);
        break;
      }
    }
    // TODO
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
  async subscribe(eventName: keyof Event): Promise<Response> {
    const identifier = crypto.randomUUID();
    const res = await this.send({
      header: {
        version: 1,
        requestId: identifier,
        messageType: "commandRequest",
        messagePurpose: "subscribe",
      },
      body: {
        eventName: eventNameAsPascalCase(eventName),
      },
    });
    return res;
  }
}
