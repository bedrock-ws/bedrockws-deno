/**
 * A script used to track events received from the Minecraft client.
 */

import { Server } from "@bedrock-ws/bedrockws";
import type { ConnectEvent, ReadyEvent } from "@bedrock-ws/bedrockws/events";

const server = new Server();

server.on("Ready", (event: ReadyEvent) => {
  console.log(`Ready at ${event.hostname}:${event.port}`);
});

server.on("Connect", (event: ConnectEvent) => {
  console.log("Connection established");
  const { client } = event;

  // Subscribe to every event
  client.subscribe("AdditionalContentLoaded");
  client.subscribe("AgentCommand");
  client.subscribe("AgentCreated");
  client.subscribe("ApiInit");
  client.subscribe("AppPaused");
  client.subscribe("AppResumed");
  client.subscribe("AppSuspended");
  client.subscribe("AwardAchievement");
  client.subscribe("BlockBroken");
  client.subscribe("BlockPlaced");
  client.subscribe("BoardTextUpdated");
  client.subscribe("BossKilled");
  client.subscribe("CameraUsed");
  client.subscribe("CauldronUsed");
  client.subscribe("ConfigurationChanged");
  client.subscribe("ConnectionFailed");
  client.subscribe("CraftingSessionCompleted");
  client.subscribe("EndOfDay");
  client.subscribe("EntitySpawned");
  client.subscribe("FileTransmissionCancelled");
  client.subscribe("FileTransmissionCompleted");
  client.subscribe("FileTransmissionStarted");
  client.subscribe("FirstTimeClientOpen");
  client.subscribe("FocusGained");
  client.subscribe("FocusLost");
  client.subscribe("GameSessionComplete");
  client.subscribe("GameSessionStart");
  client.subscribe("HardwareInfo");
  client.subscribe("HasNewContent");
  client.subscribe("ItemAcquired");
  client.subscribe("ItemCrafted");
  client.subscribe("ItemDestroyed");
  client.subscribe("ItemDropped");
  client.subscribe("ItemEnchanted");
  client.subscribe("ItemSmelted");
  client.subscribe("ItemUsed");
  client.subscribe("JoinCanceled");
  client.subscribe("JukeboxUsed");
  client.subscribe("LicenseCensus");
  client.subscribe("MascotCreated");
  client.subscribe("MenuShown");
  client.subscribe("MobInteracted");
  client.subscribe("MobKilled");
  client.subscribe("MultiplayerConnectionStateChanged");
  client.subscribe("MultiplayerRoundEnd");
  client.subscribe("MultiplayerRoundStart");
  client.subscribe("NpcPropertiesUpdated");
  client.subscribe("OptionsUpdated");
  client.subscribe("PerformanceMetrics");
  client.subscribe("PlayerBounced");
  client.subscribe("PlayerDied");
  client.subscribe("PlayerJoin");
  client.subscribe("PlayerLeave");
  client.subscribe("PlayerMessage");
  client.subscribe("PlayerTeleported");
  client.subscribe("PlayerTransform");
  client.subscribe("PlayerTravelled");
  client.subscribe("PortalBuilt");
  client.subscribe("PortalUsed");
  client.subscribe("PortfolioExported");
  client.subscribe("PotionBrewed");
  client.subscribe("PurchaseAttempt");
  client.subscribe("PurchaseResolved");
  client.subscribe("RegionalPopup");
  client.subscribe("RespondedToAcceptContent");
  client.subscribe("ScreenChanged");
  client.subscribe("ScreenHeartbeat");
  client.subscribe("SignInToEdu");
  client.subscribe("SignInToXboxLive");
  client.subscribe("SignOutOfXboxLive");
  client.subscribe("SpecialMobBuilt");
  client.subscribe("StartClient");
  client.subscribe("StartWorld");
  client.subscribe("TextToSpeechToggled");
  client.subscribe("UgcDownloadCompleted");
  client.subscribe("UgcDownloadStarted");
  client.subscribe("UploadSkin");
  client.subscribe("VehicleExited");
  client.subscribe("WorldExported");
  client.subscribe("WorldFilesListed");
  client.subscribe("WorldGenerated");
  client.subscribe("WorldLoaded");
  client.subscribe("WorldUnloaded");
});

server.launch({
  hostname: Deno.env.get("BEDROCKWS_DENO_HOST")!,
  port: parseInt(Deno.env.get("BEDROCKWS_DENO_PORT")!),
});
