// TODO: --pretty flag

import { Request, Response } from "@bedrock-ws/schema";
import * as path from "@std/path";
import * as z from "zod/v4";

const target = Deno.args.at(0);

let data
switch (target) {
  case "request":
    data = z.toJSONSchema(Request);
    break;
  case "response":
    data = z.toJSONSchema(Response);
    break;
  default:
    Deno.exit()
}

const jsonData = JSON.stringify(data);
console.log(jsonData);

const rootPath = path.dirname(import.meta.dirname!);
const docsPath = path.join(rootPath, "schemas");

Deno.writeTextFileSync(`${path.join(docsPath, target)}.schema.json`, jsonData);
