// TODO: --pretty flag

import { Request, Response } from "@bedrock-ws/schema";
import * as z from "zod/v4";

let data
switch (Deno.args.at(0)) {
  case "request":
    data = z.toJSONSchema(Request);
    break;
  case "response":
    data = z.toJSONSchema(Response);
    break;
  default:
    Deno.exit()
}

console.log(JSON.stringify(data));
