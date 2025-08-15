import * as z from "zod/v4";
import { CompatibilityVersion } from "./common.ts";
import {
  AdditionalContentLoaded,
  AgentCommand,
  AgentCreated,
  ApiInit,
  AppPaused,
  AppResumed,
  AppSuspended,
  AwardAchievement,
  BlockBroken,
  BlockPlaced,
  BoardTextUpdated,
  BossKilled,
  CameraUsed,
  CauldronUsed,
  ConfigurationChanged,
  ConnectionFailed,
  CraftingSessionCompleted,
  EndOfDay,
  EntitySpawned,
  FileTransmissionCancelled,
  FileTransmissionCompleted,
  FileTransmissionStarted,
  FirstTimeClientOpen,
  FocusGained,
  FocusLost,
  GameSessionComplete,
  GameSessionStart,
  HardwareInfo,
  HasNewContent,
  ItemAcquired,
  ItemCrafted,
  ItemDestroyed,
  ItemDropped,
  ItemEnchanted,
  ItemSmelted,
  ItemUsed,
  JoinCanceled,
  JukeboxUsed,
  LicenseCensus,
  MascotCreated,
  MenuShown,
  MobInteracted,
  MobKilled,
  MultiplayerConnectionStateChanged,
  MultiplayerRoundEnd,
  MultiplayerRoundStart,
  NpcPropertiesUpdated,
  OptionsUpdated,
  PerformanceMetrics,
  PlayerBounced,
  PlayerDied,
  PlayerJoin,
  PlayerLeave,
  PlayerMessage,
  PlayerTeleported,
  PlayerTransform,
  PlayerTravelled,
  PortalBuilt,
  PortalUsed,
  PortfolioExported,
  PotionBrewed,
  PurchaseAttempt,
  PurchaseResolved,
  RegionalPopup,
  RespondedToAcceptContent,
  ScreenChanged,
  ScreenHeartbeat,
  SignInToEdu,
  SignInToXboxLive,
  SignOutOfXboxLive,
  SpecialMobBuilt,
  StartClient,
  StartWorld,
  TextToSpeechToggled,
  UgcDownloadCompleted,
  UgcDownloadStarted,
  UploadSkin,
  VehicleExited,
  WorldExported,
  WorldFilesListed,
  WorldGenerated,
  WorldLoaded,
  WorldUnloaded,
} from "@bedrock-ws/schema/events";
import Position from "./common/Position.ts";

export const CommandResponseBodyBase = z.strictObject({
  statusCode: z.number().meta({
    description:
      "The status code of an executed command. This is negative on failure and zero on success.",
  }),
  statusMessage: z.string().meta({
    description: "The command output displayed in the chat.",
  }),
});

export const CommandResponseHeader = z.strictObject({
  messagePurpose: z.literal("commandResponse"),
  requestId: z.uuidv4(),
  version: CompatibilityVersion,
});

export const EventResponseHeader = z.strictObject({
  messagePurpose: z.literal("event"),
  version: CompatibilityVersion,
});

export const EventResponse = z.union(
  [
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("AdditionalContentLoaded"),
      }),
      body: AdditionalContentLoaded,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("AgentCommand"),
      }),
      body: AgentCommand,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("AgentCreated"),
      }),
      body: AgentCreated,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("ApiInit"),
      }),
      body: ApiInit,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("AppPaused"),
      }),
      body: AppPaused,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("AppResumed"),
      }),
      body: AppResumed,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("AppSuspended"),
      }),
      body: AppSuspended,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("AwardAchievement"),
      }),
      body: AwardAchievement,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("BlockBroken"),
      }),
      body: BlockBroken,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("BlockPlaced"),
      }),
      body: BlockPlaced,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("BoardTextUpdated"),
      }),
      body: BoardTextUpdated,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("BossKilled"),
      }),
      body: BossKilled,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("CameraUsed"),
      }),
      body: CameraUsed,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("CauldronUsed"),
      }),
      body: CauldronUsed,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("ConfigurationChanged"),
      }),
      body: ConfigurationChanged,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("ConnectionFailed"),
      }),
      body: ConnectionFailed,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("CraftingSessionCompleted"),
      }),
      body: CraftingSessionCompleted,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("EndOfDay"),
      }),
      body: EndOfDay,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("EntitySpawned"),
      }),
      body: EntitySpawned,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("FileTransmissionCancelled"),
      }),
      body: FileTransmissionCancelled,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("FileTransmissionCompleted"),
      }),
      body: FileTransmissionCompleted,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("FileTransmissionStarted"),
      }),
      body: FileTransmissionStarted,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("FirstTimeClientOpen"),
      }),
      body: FirstTimeClientOpen,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("FocusGained"),
      }),
      body: FocusGained,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("FocusLost"),
      }),
      body: FocusLost,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("GameSessionComplete"),
      }),
      body: GameSessionComplete,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("GameSessionStart"),
      }),
      body: GameSessionStart,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("HardwareInfo"),
      }),
      body: HardwareInfo,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("HasNewContent"),
      }),
      body: HasNewContent,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("ItemAcquired"),
      }),
      body: ItemAcquired,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("ItemCrafted"),
      }),
      body: ItemCrafted,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("ItemDestroyed"),
      }),
      body: ItemDestroyed,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("ItemDropped"),
      }),
      body: ItemDropped,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("ItemEnchanted"),
      }),
      body: ItemEnchanted,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("ItemSmelted"),
      }),
      body: ItemSmelted,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("ItemUsed"),
      }),
      body: ItemUsed,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("JoinCanceled"),
      }),
      body: JoinCanceled,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("JukeboxUsed"),
      }),
      body: JukeboxUsed,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("LicenseCensus"),
      }),
      body: LicenseCensus,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("MascotCreated"),
      }),
      body: MascotCreated,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("MenuShown"),
      }),
      body: MenuShown,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("MobInteracted"),
      }),
      body: MobInteracted,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("MobKilled"),
      }),
      body: MobKilled,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("MultiplayerConnectionStateChanged"),
      }),
      body: MultiplayerConnectionStateChanged,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("MultiplayerRoundEnd"),
      }),
      body: MultiplayerRoundEnd,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("MultiplayerRoundStart"),
      }),
      body: MultiplayerRoundStart,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("NpcPropertiesUpdated"),
      }),
      body: NpcPropertiesUpdated,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("OptionsUpdated"),
      }),
      body: OptionsUpdated,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("PerformanceMetrics"),
      }),
      body: PerformanceMetrics,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("PlayerBounced"),
      }),
      body: PlayerBounced,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("PlayerDied"),
      }),
      body: PlayerDied,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("PlayerJoin"),
      }),
      body: PlayerJoin,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("PlayerLeave"),
      }),
      body: PlayerLeave,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("PlayerMessage"),
      }),
      body: PlayerMessage,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("PlayerTeleported"),
      }),
      body: PlayerTeleported,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("PlayerTransform"),
      }),
      body: PlayerTransform,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("PlayerTravelled"),
      }),
      body: PlayerTravelled,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("PortalBuilt"),
      }),
      body: PortalBuilt,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("PortalUsed"),
      }),
      body: PortalUsed,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("PortfolioExported"),
      }),
      body: PortfolioExported,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("PotionBrewed"),
      }),
      body: PotionBrewed,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("PurchaseAttempt"),
      }),
      body: PurchaseAttempt,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("PurchaseResolved"),
      }),
      body: PurchaseResolved,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("RegionalPopup"),
      }),
      body: RegionalPopup,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("RespondedToAcceptContent"),
      }),
      body: RespondedToAcceptContent,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("ScreenChanged"),
      }),
      body: ScreenChanged,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("ScreenHeartbeat"),
      }),
      body: ScreenHeartbeat,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("SignInToEdu"),
      }),
      body: SignInToEdu,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("SignInToXboxLive"),
      }),
      body: SignInToXboxLive,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("SignOutOfXboxLive"),
      }),
      body: SignOutOfXboxLive,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("SpecialMobBuilt"),
      }),
      body: SpecialMobBuilt,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("StartClient"),
      }),
      body: StartClient,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("StartWorld"),
      }),
      body: StartWorld,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("TextToSpeechToggled"),
      }),
      body: TextToSpeechToggled,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("UgcDownloadCompleted"),
      }),
      body: UgcDownloadCompleted,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("UgcDownloadStarted"),
      }),
      body: UgcDownloadStarted,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("UploadSkin"),
      }),
      body: UploadSkin,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("VehicleExited"),
      }),
      body: VehicleExited,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("WorldExported"),
      }),
      body: WorldExported,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("WorldFilesListed"),
      }),
      body: WorldFilesListed,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("WorldGenerated"),
      }),
      body: WorldGenerated,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("WorldLoaded"),
      }),
      body: WorldLoaded,
    }),
    z.strictObject({
      header: EventResponseHeader.extend({
        eventName: z.literal("WorldUnloaded"),
      }),
      body: WorldUnloaded,
    }),
  ] as const,
);

export const CommandResponseTellCommand = z.strictObject({
  header: CommandResponseHeader,
  body: CommandResponseBodyBase.extend({
    message: z.string().meta({ description: "The message that got send" }),
    recipient: z.array(z.string()).meta({
      description: "Names of players who received the message",
    }),
  }),
}).meta({
  description:
    "The response of the event when the player uses the `tell`/`w`/`msg` command",
});

export const CommandResponseWithDetails = z.strictObject({
  header: CommandResponseHeader,
  body: CommandResponseBodyBase.extend({
    details: z.string(),
  }),
}).meta({
  description: "The response of getlocalplayername and querytarget commands",
});

export const CommandResponseOther = z.strictObject({
  header: CommandResponseHeader,
  body: CommandResponseBodyBase.extend({}),
}).meta({ description: "The base of an response" });

export const CommandResponseAgentGetPosition = z.strictObject({
  header: CommandResponseHeader,
  body: CommandResponseBodyBase.extend({
    position: Position,
  })
})

export const CommandResponse = z.union(
  [
    CommandResponseTellCommand,
    CommandResponseWithDetails,
    CommandResponseAgentGetPosition,
    CommandResponseOther,
  ] as const,
);

export const ErrorResponse = z.strictObject({
  header: z.strictObject({
    messagePurpose: z.literal("error"),
    requestId: z.uuidv4(),
    version: CompatibilityVersion,
  }),
  body: z.strictObject({}), // TODO
});

export const Response = z.union(
  [EventResponse, CommandResponse, ErrorResponse] as const,
);
