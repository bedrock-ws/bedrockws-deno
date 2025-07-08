/**
 * A script used to track events received from the Minecraft client.
 */

import { Server } from "@bedrock-ws/bedrockws";
import type { ConnectEvent, ReadyEvent } from "@bedrock-ws/bedrockws/events";

const server = new Server();

server.on("ready", (event: ReadyEvent) => {
  console.log(`Ready at ${event.hostname}:${event.port}`);
});

server.on("connect", (event: ConnectEvent) => {
  console.log("Connection established");
  const { client } = event;

  // Subscribe to every event
  client.subscribe("additionalContentLoaded");
  client.subscribe("agentCommand");
  client.subscribe("agentCreated");
  client.subscribe("apiInit");
  client.subscribe("appPaused");
  client.subscribe("appResumed");
  client.subscribe("appSuspended");
  client.subscribe("awardAchievement");
  client.subscribe("blockBroken");
  client.subscribe("blockPlaced");
  client.subscribe("boardTextUpdated");
  client.subscribe("bossKilled");
  client.subscribe("cameraUsed");
  client.subscribe("cauldronUsed");
  client.subscribe("configurationChanged");
  client.subscribe("connectionFailed");
  client.subscribe("craftingSessionCompleted");
  client.subscribe("endOfDay");
  client.subscribe("entitySpawned");
  client.subscribe("fileTransmissionCancelled");
  client.subscribe("fileTransmissionCompleted");
  client.subscribe("fileTransmissionStarted");
  client.subscribe("firstTimeClientOpen");
  client.subscribe("focusGained");
  client.subscribe("focusLost");
  client.subscribe("gameSessionComplete");
  client.subscribe("gameSessionStart");
  client.subscribe("hardwareInfo");
  client.subscribe("hasNewContent");
  client.subscribe("itemAcquired");
  client.subscribe("itemCrafted");
  client.subscribe("itemDestroyed");
  client.subscribe("itemDropped");
  client.subscribe("itemEnchanted");
  client.subscribe("itemSmelted");
  client.subscribe("itemUsed");
  client.subscribe("joinCanceled");
  client.subscribe("jukeboxUsed");
  client.subscribe("licenseCensus");
  client.subscribe("mascotCreated");
  client.subscribe("menuShown");
  client.subscribe("mobInteracted");
  client.subscribe("mobKilled");
  client.subscribe("multiplayerConnectionStateChanged");
  client.subscribe("multiplayerRoundEnd");
  client.subscribe("multiplayerRoundStart");
  client.subscribe("npcPropertiesUpdated");
  client.subscribe("optionsUpdated");
  client.subscribe("performanceMetrics");
  client.subscribe("playerBounced");
  client.subscribe("playerDied");
  client.subscribe("playerJoin");
  client.subscribe("playerLeave");
  client.subscribe("playerMessage");
  client.subscribe("playerTeleported");
  client.subscribe("playerTransform");
  client.subscribe("playerTravelled");
  client.subscribe("portalBuilt");
  client.subscribe("portalUsed");
  client.subscribe("portfolioExported");
  client.subscribe("potionBrewed");
  client.subscribe("purchaseAttempt");
  client.subscribe("purchaseResolved");
  client.subscribe("regionalPopup");
  client.subscribe("respondedToAcceptContent");
  client.subscribe("screenChanged");
  client.subscribe("screenHeartbeat");
  client.subscribe("signInToEdu");
  client.subscribe("signInToXboxLive");
  client.subscribe("signOutOfXboxLive");
  client.subscribe("specialMobBuilt");
  client.subscribe("startClient");
  client.subscribe("startWorld");
  client.subscribe("textToSpeechToggled");
  client.subscribe("ugcDownloadCompleted");
  client.subscribe("ugcDownloadStarted");
  client.subscribe("uploadSkin");
  client.subscribe("vehicleExited");
  client.subscribe("worldExported");
  client.subscribe("worldFilesListed");
  client.subscribe("worldGenerated");
  client.subscribe("worldLoaded");
  client.subscribe("worldUnloaded");
});

server.launch({
  hostname: Deno.env.get("BEDROCKWS_DENO_HOST")!,
  port: parseInt(Deno.env.get("BEDROCKWS_DENO_PORT")!),
});
