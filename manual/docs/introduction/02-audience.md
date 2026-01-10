---
sidebar_position: 2
---

# When Should I Utilize WebSockets?

Minecraft supports scripting in JavaScript in behavior packs with a large and
up-to-date API. The WebSockets API however is
[ancient](https://minecraft.wiki/w/Commands/wsserver#History) and only supports
a very small subset of what you can do with the JavaScript API. So why should I
use this ancient method over the JavaScript API? There are some reasons:

1. Console versions of MCBE only support using Add-Ons from the Marketplace
   store. It is possible to "inspect and modify" the world hosted on a console
   using a WebSocket connection. This is not very straight forward and will be
   explained in a following chapter.
2. The JavaScript API is sandboxed and for instance does not allow network
   requests. The WebSocket server can do anything essentially.
3. A WebSocket server can handle multiple clients (players) at once and for
   example support a connection between them. The clients do not need to be in
   the same world.
4. Zero setup: Assuming you run a WebSocket server available for everyone,
   clients (players) can connect to the server without needing to download
   anything.
