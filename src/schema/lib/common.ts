import * as z from "zod/v4";

export const CompatibilityVersion = z.number().meta({
  description:
    "Number representing the compatibility version. This is always 17104896 as of writing and represents Minecraft version 1.5.0",
});
