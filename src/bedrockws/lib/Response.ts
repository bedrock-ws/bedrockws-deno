import type { z } from "zod/v4";
import type { Response as ResponseSchema } from "@bedrock-ws/schema";

/**
 * The response received from a WebSocket server.
 */
export default class Response {
  private readonly data: z.infer<typeof ResponseSchema>;

  constructor(data: z.infer<typeof ResponseSchema>) {
    this.data = data;
  }

  get ok(): boolean {
    if (this.header.messagePurpose === "error") {
      return false;
    }
    if (this.header.messagePurpose === "commandResponse") {
      const data = this.data as Extract<
        z.infer<typeof ResponseSchema>,
        { "header": { "messagePurpose": "commandResponse" } }
      >;
      return data.body.statusCode === 0;
    }
    return true;
  }

  get header(): z.infer<typeof ResponseSchema>["header"] {
    return this.data.header;
  }

  get body(): z.infer<typeof ResponseSchema>["body"] {
    return this.data.body;
  }
}
