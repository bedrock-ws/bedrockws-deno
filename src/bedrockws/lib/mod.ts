// TODO: remove all console.* calls
// TODO: enforce pascal case event names in api
// TODO: encryption; see also: https://github.com/Sandertv/mcwss/blob/master/encryption.go

export { default as Client } from "./Client.ts";
export { default as Server } from "./Server.ts";
export * as events from "./events.ts";
export * as consts from "./consts.ts";

import type { z } from "zod/v4";
import type {
  Request as RequestSchema,
  Response as ResponseSchema,
} from "@bedrock-ws/schema";

// TODO: move Response and Request to separate modules

export class Response {
  private readonly data: z.infer<typeof ResponseSchema>;

  constructor(data: z.infer<typeof ResponseSchema>) {
    this.data = data;
  }

  get ok() {
    if (this.header.messagePurpose === "error") {
      return false;
    }
    if (this.header.messagePurpose === "commandResponse") {
      const data = this.data as Extract<z.infer<typeof ResponseSchema>, {"header": {"messagePurpose": "commandResponse"}}>;
      return data.body.statusCode === 0;
    }
    return true;
  }

  get header() {
    return this.data.header;
  }

  get body() {
    return this.data.body;
  }
}

export type Request = z.infer<typeof RequestSchema>; // TODO: make this a class
