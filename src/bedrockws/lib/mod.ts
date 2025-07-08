// FIXME: Server sometimes randomly closes connection; see also: https://github.com/denoland/deno/discussions/13168.
//        It cannot be the ping idle as python websockets.py uses 20 and Deno uses 30 (even setting it to 60 does not
//        help).
// TODO: remove all console.* calls
// TODO: separate lib in same workspace for ui stuff
// TODO: enforce pascal case event names in api

export { default as Client } from "./Client.ts";
export { default as Server } from "./Server.ts";
export type { default as Request } from "./Request.ts";
export type { default as Response } from "./Response.ts";
export * as events from "./events.ts";
export * as consts from "./consts.ts";
