import type { JsonValue } from "@std/json";

export default interface Response {
  header: Header;
  body: Body;
}

export interface Header {
  eventName: string;
  messagePurpose: string;
  requestId: string;
}

export type Body = any; // TODO: prefer JsonValue or use zod
