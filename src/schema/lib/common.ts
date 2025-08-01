import * as z from "zod/v4";

export const EventName = z.enum([
  "AdditionalContentLoaded",
  "AgentCommand",
  "AgentCreated",
  "ApiInit",
  "AppPaused",
  "AppResumed",
  "AppSuspended",
  "AwardAchievement",
  "BlockBroken",
  "BlockPlaced",
  "BoardTextUpdated",
  "BossKilled",
  "CameraUsed",
  "CauldronUsed",
  "ConfigurationChanged",
  "ConnectionFailed",
  "CraftingSessionCompleted",
  "EndOfDay",
  "EntitySpawned",
  "FileTransmissionCancelled",
  "FileTransmissionCompleted",
  "FileTransmissionStarted",
  "FirstTimeClientOpen",
  "FocusGained",
  "FocusLost",
  "GameSessionComplete",
  "GameSessionStart",
  "HardwareInfo",
  "HasNewContent",
  "ItemAcquired",
  "ItemCrafted",
  "ItemDestroyed",
  "ItemDropped",
  "ItemEnchanted",
  "ItemSmelted",
  "ItemUsed",
  "JoinCanceled",
  "JukeboxUsed",
  "LicenseCensus",
  "MascotCreated",
  "MenuShown",
  "MobInteracted",
  "MobKilled",
  "MultiplayerConnectionStateChanged",
  "MultiplayerRoundEnd",
  "MultiplayerRoundStart",
  "NpcPropertiesUpdated",
  "OptionsUpdated",
  "PerformanceMetrics",
  "PlayerBounced",
  "PlayerDied",
  "PlayerJoin",
  "PlayerLeave",
  "PlayerMessage",
  "PlayerTeleported",
  "PlayerTransform",
  "PlayerTravelled",
  "PortalBuilt",
  "PortalUsed",
  "PortfolioExported",
  "PotionBrewed",
  "PurchaseAttempt",
  "PurchaseResolved",
  "RegionalPopup",
  "RespondedToAcceptContent",
  "ScreenChanged",
  "ScreenHeartbeat",
  "SignInToEdu",
  "SignInToXboxLive",
  "SignOutOfXboxLive",
  "SpecialMobBuilt",
  "StartClient",
  "StartWorld",
  "TextToSpeechToggled",
  "UgcDownloadCompleted",
  "UgcDownloadStarted",
  "UploadSkin",
  "VehicleExited",
  "WorldExported",
  "WorldFilesListed",
  "WorldGenerated",
  "WorldLoaded",
  "WorldUnloaded",
] as const);

export const CompatibilityVersion = z.number().meta({
  description:
    "Number representing the compatibility version. This is always 17104896 as of writing and represents Minecraft version 1.5.0",
});
