# `@bedrock-ws/schema`

This library contains the schema definitions of both requests accepted by the
Minecraft client through WebSocket and the schema sent by the Minecraft client
to the server.

> [!IMPORTANT]
> A lot of events are no longer supported in recent Minecraft versions or were
> never supported outside the Education Edition.

## JSON Schema

You can generate [JSON Schema][JSON Schema]s with these commands:

```console
deno task --quiet json-schema request
deno task --quiet json-schema response
```

## Versioning

Minecraft is likely not going to update the WebSocket schema. It may happen that
this library updates the schema but it will just be patch updates according to
[SemVer][SemVer].

[JSON Schema]: https://json-schema.org/
[SemVer]: https://semver.org/
