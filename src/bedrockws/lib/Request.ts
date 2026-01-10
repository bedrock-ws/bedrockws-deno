import type { z } from "zod/v4";
import type { Request as RequestSchema } from "@bedrock-ws/schema";

export default class Request {
  private readonly data: z.infer<typeof RequestSchema>;

  constructor(data: z.infer<typeof RequestSchema>) {
    this.data = data;
  }

  get header(): z.infer<typeof RequestSchema>["header"] {
    return this.data.header;
  }

  get body(): z.infer<typeof RequestSchema>["body"] {
    return this.data.body;
  }
}
