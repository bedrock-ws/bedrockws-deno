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

export type Request = z.infer<typeof RequestSchema>;
export type Response = z.infer<typeof ResponseSchema>;
