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

## Status of Events

| Event name                        | Structure known? | File                                                                                        |
| --------------------------------- | ---------------- | ------------------------------------------------------------------------------------------- |
| AdditionalContentLoaded           | ❌               | [`AdditionalContentLoaded.ts`](./lib/events/AdditionalContentLoaded.ts)                     |
| AgentCommand                      | ❌               | [`AgentCommand.ts`](./lib/events/AgentCommand.ts)                                           |
| AgentCreated                      | ❌               | [`AgentCreated.ts`](./lib/events/AgentCreated.ts)                                           |
| ApiInit                           | ❌               | [`ApiInit.ts`](./lib/events/ApiInit.ts)                                                     |
| AppPaused                         | ❌               | [`AppPaused.ts`](./lib/events/AppPaused.ts)                                                 |
| AppResumed                        | ❌               | [`AppResumed.ts`](./lib/events/AppResumed.ts)                                               |
| AppSuspended                      | ❌               | [`AppSuspended.ts`](./lib/events/AppSuspended.ts)                                           |
| AwardAchievement                  | ❌               | [`AwardAchievement.ts`](./lib/events/AwardAchievement.ts)                                   |
| BlockBroken                       | ✅               | [`BlockBroken.ts`](./lib/events/BlockBroken.ts)                                             |
| BlockPlaced                       | ✅               | [`BlockPlaced.ts`](./lib/events/BlockPlaced.ts)                                             |
| BoardTextUpdated                  | ❌               | [`BoardTextUpdated.ts`](./lib/events/BoardTextUpdated.ts)                                   |
| BossKilled                        | ❌               | [`BossKilled.ts`](./lib/events/BossKilled.ts)                                               |
| CameraUsed                        | ❌               | [`CameraUsed.ts`](./lib/events/CameraUsed.ts)                                               |
| CauldronUsed                      | ❌               | [`CauldronUsed.ts`](./lib/events/CauldronUsed.ts)                                           |
| ConfigurationChanged              | ❌               | [`ConfigurationChanged.ts`](./lib/events/ConfigurationChanged.ts)                           |
| ConnectionFailed                  | ❌               | [`ConnectionFailed.ts`](./lib/events/ConnectionFailed.ts)                                   |
| CraftingSessionCompleted          | ❌               | [`CraftingSessionCompleted.ts`](./lib/events/CraftingSessionCompleted.ts)                   |
| EndOfDay                          | ✅               | [`EndOfDay.ts`](./lib/events/EndOfDay.ts)                                                   |
| EntitySpawned                     | ❌               | [`EntitySpawned.ts`](./lib/events/EntitySpawned.ts)                                         |
| FileTransmissionCancelled         | ❌               | [`FileTransmissionCancelled.ts`](./lib/events/FileTransmissionCancelled.ts)                 |
| FileTransmissionCompleted         | ❌               | [`FileTransmissionCompleted.ts`](./lib/events/FileTransmissionCompleted.ts)                 |
| FileTransmissionStarted           | ❌               | [`FileTransmissionStarted.ts`](./lib/events/FileTransmissionStarted.ts)                     |
| FirstTimeClientOpen               | ❌               | [`FirstTimeClientOpen.ts`](./lib/events/FirstTimeClientOpen.ts)                             |
| FocusGained                       | ❌               | [`FocusGained.ts`](./lib/events/FocusGained.ts)                                             |
| FocusLost                         | ❌               | [`FocusLost.ts`](./lib/events/FocusLost.ts)                                                 |
| GameSessionComplete               | ❌               | [`GameSessionComplete.ts`](./lib/events/GameSessionComplete.ts)                             |
| GameSessionStart                  | ❌               | [`GameSessionStart.ts`](./lib/events/GameSessionStart.ts)                                   |
| HardwareInfo                      | ❌               | [`HardwareInfo.ts`](./lib/events/HardwareInfo.ts)                                           |
| HasNewContent                     | ❌               | [`HasNewContent.ts`](./lib/events/HasNewContent.ts)                                         |
| ItemAcquired                      | ❌               | [`ItemAcquired.ts`](./lib/events/ItemAcquired.ts)                                           |
| ItemCrafted                       | ❌               | [`ItemCrafted.ts`](./lib/events/ItemCrafted.ts)                                             |
| ItemDestroyed                     | ❌               | [`ItemDestroyed.ts`](./lib/events/ItemDestroyed.ts)                                         |
| ItemDropped                       | ✅               | [`ItemDropped.ts`](./lib/events/ItemDropped.ts)                                             |
| ItemEnchanted                     | ❌               | [`ItemEnchanted.ts`](./lib/events/ItemEnchanted.ts)                                         |
| ItemSmelted                       | ✅               | [`ItemSmelted.ts`](./lib/events/ItemSmelted.ts)                                             |
| ItemUsed                          | ✅               | [`ItemUsed.ts`](./lib/events/ItemUsed.ts)                                                   |
| JoinCanceled                      | ❌               | [`JoinCanceled.ts`](./lib/events/JoinCanceled.ts)                                           |
| JukeboxUsed                       | ❌               | [`JukeboxUsed.ts`](./lib/events/JukeboxUsed.ts)                                             |
| LicenseCensus                     | ❌               | [`LicenseCensus.ts`](./lib/events/LicenseCensus.ts)                                         |
| MascotCreated                     | ❌               | [`MascotCreated.ts`](./lib/events/MascotCreated.ts)                                         |
| MenuShown                         | ❌               | [`MenuShown.ts`](./lib/events/MenuShown.ts)                                                 |
| MobInteracted                     | ❌               | [`MobInteracted.ts`](./lib/events/MobInteracted.ts)                                         |
| MobKilled                         | ✅               | [`MobKilled.ts`](./lib/events/MobKilled.ts)                                                 |
| MultiplayerConnectionStateChanged | ❌               | [`MultiplayerConnectionStateChanged.ts`](./lib/events/MultiplayerConnectionStateChanged.ts) |
| MultiplayerRoundEnd               | ❌               | [`MultiplayerRoundEnd.ts`](./lib/events/MultiplayerRoundEnd.ts)                             |
| MultiplayerRoundStart             | ❌               | [`MultiplayerRoundStart.ts`](./lib/events/MultiplayerRoundStart.ts)                         |
| NpcPropertiesUpdated              | ❌               | [`NpcPropertiesUpdated.ts`](./lib/events/NpcPropertiesUpdated.ts)                           |
| OptionsUpdated                    | ❌               | [`OptionsUpdated.ts`](./lib/events/OptionsUpdated.ts)                                       |
| PerformanceMetrics                | ❌               | [`PerformanceMetrics.ts`](./lib/events/PerformanceMetrics.ts)                               |
| PlayerBounced                     | ✅               | [`PlayerBounced.ts`](./lib/events/PlayerBounced.ts)                                         |
| PlayerDied                        | ✅               | [`PlayerDied.ts`](./lib/events/PlayerDied.ts)                                               |
| PlayerJoin                        | ❌               | [`PlayerJoin.ts`](./lib/events/PlayerJoin.ts)                                               |
| PlayerLeave                       | ❌               | [`PlayerLeave.ts`](./lib/events/PlayerLeave.ts)                                             |
| PlayerMessage                     | ✅               | [`PlayerMessage.ts`](./lib/events/PlayerMessage.ts)                                         |
| PlayerTeleported                  | ✅               | [`PlayerTeleported.ts`](./lib/events/PlayerTeleported.ts)                                   |
| PlayerTransform                   | ✅               | [`PlayerTransform.ts`](./lib/events/PlayerTransform.ts)                                     |
| PlayerTravelled                   | ✅               | [`PlayerTravelled.ts`](./lib/events/PlayerTravelled.ts)                                     |
| PortalBuilt                       | ❌               | [`PortalBuilt.ts`](./lib/events/PortalBuilt.ts)                                             |
| PortalUsed                        | ❌               | [`PortalUsed.ts`](./lib/events/PortalUsed.ts)                                               |
| PortfolioExported                 | ❌               | [`PortfolioExported.ts`](./lib/events/PortfolioExported.ts)                                 |
| PotionBrewed                      | ❌               | [`PotionBrewed.ts`](./lib/events/PotionBrewed.ts)                                           |
| PurchaseAttempt                   | ❌               | [`PurchaseAttempt.ts`](./lib/events/PurchaseAttempt.ts)                                     |
| PurchaseResolved                  | ❌               | [`PurchaseResolved.ts`](./lib/events/PurchaseResolved.ts)                                   |
| RegionalPopup                     | ❌               | [`RegionalPopup.ts`](./lib/events/RegionalPopup.ts)                                         |
| RespondedToAcceptContent          | ❌               | [`RespondedToAcceptContent.ts`](./lib/events/RespondedToAcceptContent.ts)                   |
| ScreenChanged                     | ❌               | [`ScreenChanged.ts`](./lib/events/ScreenChanged.ts)                                         |
| ScreenHeartbeat                   | ❌               | [`ScreenHeartbeat.ts`](./lib/events/ScreenHeartbeat.ts)                                     |
| SignInToEdu                       | ❌               | [`SignInToEdu.ts`](./lib/events/SignInToEdu.ts)                                             |
| SignInToXboxLive                  | ❌               | [`SignInToXboxLive.ts`](./lib/events/SignInToXboxLive.ts)                                   |
| SignOutOfXboxLive                 | ❌               | [`SignOutOfXboxLive.ts`](./lib/events/SignOutOfXboxLive.ts)                                 |
| SpecialMobBuilt                   | ❌               | [`SpecialMobBuilt.ts`](./lib/events/SpecialMobBuilt.ts)                                     |
| StartClient                       | ❌               | [`StartClient.ts`](./lib/events/StartClient.ts)                                             |
| StartWorld                        | ❌               | [`StartWorld.ts`](./lib/events/StartWorld.ts)                                               |
| TextToSpeechToggled               | ❌               | [`TextToSpeechToggled.ts`](./lib/events/TextToSpeechToggled.ts)                             |
| UgcDownloadCompleted              | ❌               | [`UgcDownloadCompleted.ts`](./lib/events/UgcDownloadCompleted.ts)                           |
| UgcDownloadStarted                | ❌               | [`UgcDownloadStarted.ts`](./lib/events/UgcDownloadStarted.ts)                               |
| UploadSkin                        | ❌               | [`UploadSkin.ts`](./lib/events/UploadSkin.ts)                                               |
| VehicleExited                     | ❌               | [`VehicleExited.ts`](./lib/events/VehicleExited.ts)                                         |
| WorldExported                     | ❌               | [`WorldExported.ts`](./lib/events/WorldExported.ts)                                         |
| WorldFilesListed                  | ❌               | [`WorldFilesListed.ts`](./lib/events/WorldFilesListed.ts)                                   |
| WorldGenerated                    | ❌               | [`WorldGenerated.ts`](./lib/events/WorldGenerated.ts)                                       |
| WorldLoaded                       | ❌               | [`WorldLoaded.ts`](./lib/events/WorldLoaded.ts)                                             |
| WorldUnloaded                     | ❌               | [`WorldUnloaded.ts`](./lib/events/WorldUnloaded.ts)                                         |

## Versioning

Minecraft is likely not going to update the WebSocket schema. It may happen that
this library updates the schema but it will just be patch updates according to
[SemVer][SemVer].

[JSON Schema]: https://json-schema.org/
[SemVer]: https://semver.org/
