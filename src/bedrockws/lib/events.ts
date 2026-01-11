import type Server from "./Server.ts";
import type Client from "./Client.ts";
import type { Response } from "./mod.ts";
import type * as event from "@bedrock-ws/schema/events";
import type { RawText } from "@minecraft/server";
import type { z } from "zod/v4";

/** Events the server can trigger. */
export interface ServerEvent {
  Ready: (event: ReadyEvent) => void;
}

/** Events the client can trigger. */
export interface ClientEvent {
  Connect: (event: ConnectEvent) => void;
  Disconnect: (event: DisconnectEvent) => void;
}

/** Events the game can trigger. */
export interface GameEvent {
  AdditionalContentLoaded: (event: AdditionalContentLoadedEvent) => void;
  AgentCommand: (event: AgentCommandEvent) => void;
  AgentCreated: (event: AgentCreatedEvent) => void;
  ApiInit: (event: ApiInitEvent) => void;
  AppPaused: (event: AppPausedEvent) => void;
  AppResumed: (event: AppResumedEvent) => void;
  AppSuspended: (event: AppSuspendedEvent) => void;
  AwardAchievement: (event: AwardAchievementEvent) => void;
  BlockBroken: (event: BlockBrokenEvent) => void;
  BlockPlaced: (event: BlockPlacedEvent) => void;
  BoardTextUpdated: (event: BoardTextUpdatedEvent) => void;
  BossKilled: (event: BossKilledEvent) => void;
  CameraUsed: (event: CameraUsedEvent) => void;
  CauldronUsed: (event: CauldronUsedEvent) => void;
  ConfigurationChanged: (event: ConfigurationChangedEvent) => void;
  ConnectionFailed: (event: ConnectionFailedEvent) => void;
  CraftingSessionCompleted: (event: CraftingSessionCompletedEvent) => void;
  EndOfDay: (event: EndOfDayEvent) => void;
  EntitySpawned: (event: EntitySpawnedEvent) => void;
  FileTransmissionCancelled: (event: FileTransmissionCancelledEvent) => void;
  FileTransmissionCompleted: (event: FileTransmissionCompletedEvent) => void;
  FileTransmissionStarted: (event: FileTransmissionStartedEvent) => void;
  FirstTimeClientOpen: (event: FirstTimeClientOpenEvent) => void;
  FocusGained: (event: FocusGainedEvent) => void;
  FocusLost: (event: FocusLostEvent) => void;
  GameSessionComplete: (event: GameSessionCompleteEvent) => void;
  GameSessionStart: (event: GameSessionStartEvent) => void;
  HardwareInfo: (event: HardwareInfoEvent) => void;
  HasNewContent: (event: HasNewContentEvent) => void;
  ItemAcquired: (event: ItemAcquiredEvent) => void;
  ItemCrafted: (event: ItemCraftedEvent) => void;
  ItemDestroyed: (event: ItemDestroyedEvent) => void;
  ItemDropped: (event: ItemDroppedEvent) => void;
  ItemEnchanted: (event: ItemEnchantedEvent) => void;
  ItemSmelted: (event: ItemSmeltedEvent) => void;
  ItemUsed: (event: ItemUsedEvent) => void;
  JoinCanceled: (event: JoinCanceledEvent) => void;
  JukeboxUsed: (event: JukeboxUsedEvent) => void;
  LicenseCensus: (event: LicenseCensusEvent) => void;
  MascotCreated: (event: MascotCreatedEvent) => void;
  MenuShown: (event: MenuShownEvent) => void;
  MobInteracted: (event: MobInteractedEvent) => void;
  MobKilled: (event: MobKilledEvent) => void;
  MultiplayerConnectionStateChanged: (
    event: MultiplayerConnectionStateChangedEvent,
  ) => void;
  MultiplayerRoundEnd: (event: MultiplayerRoundEndEvent) => void;
  MultiplayerRoundStart: (event: MultiplayerRoundStartEvent) => void;
  NpcPropertiesUpdated: (event: NpcPropertiesUpdatedEvent) => void;
  OptionsUpdated: (event: OptionsUpdatedEvent) => void;
  PerformanceMetrics: (event: PerformanceMetricsEvent) => void;
  PlayerBounced: (event: PlayerBouncedEvent) => void;
  PlayerDied: (event: PlayerDiedEvent) => void;
  PlayerJoin: (event: PlayerJoinEvent) => void;
  PlayerLeave: (event: PlayerLeaveEvent) => void;
  PlayerMessage: (event: PlayerMessageEvent) => void;
  PlayerTeleported: (event: PlayerTeleportedEvent) => void;
  PlayerTransform: (event: PlayerTransformEvent) => void;
  PlayerTravelled: (event: PlayerTravelledEvent) => void;
  PortalBuilt: (event: PortalBuiltEvent) => void;
  PortalUsed: (event: PortalUsedEvent) => void;
  PortfolioExported: (event: PortfolioExportedEvent) => void;
  PotionBrewed: (event: PotionBrewedEvent) => void;
  PurchaseAttempt: (event: PurchaseAttemptEvent) => void;
  PurchaseResolved: (event: PurchaseResolvedEvent) => void;
  RegionalPopup: (event: RegionalPopupEvent) => void;
  RespondedToAcceptContent: (event: RespondedToAcceptContentEvent) => void;
  ScreenChanged: (event: ScreenChangedEvent) => void;
  ScreenHeartbeat: (event: ScreenHeartbeatEvent) => void;
  SignInToEdu: (event: SignInToEduEvent) => void;
  SignInToXboxLive: (event: SignInToXboxLiveEvent) => void;
  SignOutOfXboxLive: (event: SignOutOfXboxLiveEvent) => void;
  SpecialMobBuilt: (event: SpecialMobBuiltEvent) => void;
  StartClient: (event: StartClientEvent) => void;
  StartWorld: (event: StartWorldEvent) => void;
  TextToSpeechToggled: (event: TextToSpeechToggledEvent) => void;
  UgcDownloadCompleted: (event: UgcDownloadCompletedEvent) => void;
  UgcDownloadStarted: (event: UgcDownloadStartedEvent) => void;
  UploadSkin: (event: UploadSkinEvent) => void;
  VehicleExited: (event: VehicleExitedEvent) => void;
  WorldExported: (event: WorldExportedEvent) => void;
  WorldFilesListed: (event: WorldFilesListedEvent) => void;
  WorldGenerated: (event: WorldGeneratedEvent) => void;
  WorldLoaded: (event: WorldLoadedEvent) => void;
  WorldUnloaded: (event: WorldUnloadedEvent) => void;
}

export type Event = ServerEvent & ClientEvent & GameEvent;

export interface EventBase {
  /** Reference to the server. */
  server: Server;
}

export interface ServerEventBase extends EventBase {}

export interface ClientEventBase extends EventBase {
  /** The client that triggered the event. */
  client: Client;
}

export interface GameEventBase extends ClientEventBase {}

export class ReadyEvent implements ServerEventBase {
  server: Server;
  hostname: string;
  port: number;

  constructor(
    options: { server: Server; hostname: string; port: number },
  ) {
    this.server = options.server;
    this.hostname = options.hostname;
    this.port = options.port;
  }
}

export class ConnectEvent implements GameEventBase {
  server: Server;
  client: Client;

  constructor(options: { server: Server; client: Client }) {
    this.server = options.server;
    this.client = options.client;
  }
}

export class DisconnectEvent implements GameEventBase {
  server: Server;
  client: Client;
  code: number;

  constructor(options: { server: Server; client: Client; code: number }) {
    this.server = options.server;
    this.client = options.client;
    this.code = options.code;
  }
}

export class AdditionalContentLoadedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.AdditionalContentLoaded>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.AdditionalContentLoaded>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class AgentCommandEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.AgentCommand>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.AgentCommand>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class AgentCreatedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.AgentCreated>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.AgentCreated>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class ApiInitEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.ApiInit>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.ApiInit>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class AppPausedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.AppPaused>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.AppPaused>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class AppResumedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.AppResumed>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.AppResumed>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class AppSuspendedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.AppSuspended>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.AppSuspended>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class AwardAchievementEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.AwardAchievement>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.AwardAchievement>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class BlockBrokenEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.BlockBroken>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.BlockBroken>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class BlockPlacedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.BlockPlaced>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.BlockPlaced>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class BoardTextUpdatedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.BoardTextUpdated>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.BoardTextUpdated>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class BossKilledEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.BossKilled>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.BossKilled>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class CameraUsedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.CameraUsed>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.CameraUsed>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class CauldronUsedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.CauldronUsed>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.CauldronUsed>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class ConfigurationChangedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.ConfigurationChanged>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.ConfigurationChanged>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class ConnectionFailedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.ConnectionFailed>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.ConnectionFailed>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class CraftingSessionCompletedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.CraftingSessionCompleted>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.CraftingSessionCompleted>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class EndOfDayEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.EndOfDay>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.EndOfDay>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class EntitySpawnedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.EntitySpawned>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.EntitySpawned>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class FileTransmissionCancelledEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.FileTransmissionCancelled>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.FileTransmissionCancelled>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class FileTransmissionCompletedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.FileTransmissionCompleted>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.FileTransmissionCompleted>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class FileTransmissionStartedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.FileTransmissionStarted>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.FileTransmissionStarted>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class FirstTimeClientOpenEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.FirstTimeClientOpen>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.FirstTimeClientOpen>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class FocusGainedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.FocusGained>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.FocusGained>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class FocusLostEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.FocusLost>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.FocusLost>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class GameSessionCompleteEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.GameSessionComplete>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.GameSessionComplete>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class GameSessionStartEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.GameSessionStart>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.GameSessionStart>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class HardwareInfoEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.HardwareInfo>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.HardwareInfo>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class HasNewContentEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.HasNewContent>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.HasNewContent>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class ItemAcquiredEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.ItemAcquired>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.ItemAcquired>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class ItemCraftedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.ItemCrafted>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.ItemCrafted>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class ItemDestroyedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.ItemDestroyed>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.ItemDestroyed>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class ItemDroppedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.ItemDropped>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.ItemDropped>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class ItemEnchantedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.ItemEnchanted>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.ItemEnchanted>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class ItemSmeltedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.ItemSmelted>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.ItemSmelted>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class ItemUsedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.ItemUsed>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.ItemUsed>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class JoinCanceledEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.JoinCanceled>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.JoinCanceled>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class JukeboxUsedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.JukeboxUsed>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.JukeboxUsed>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class LicenseCensusEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.LicenseCensus>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.LicenseCensus>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class MascotCreatedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.MascotCreated>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.MascotCreated>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class MenuShownEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.MenuShown>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.MenuShown>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class MobInteractedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.MobInteracted>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.MobInteracted>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class MobKilledEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.MobKilled>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.MobKilled>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class MultiplayerConnectionStateChangedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.MultiplayerConnectionStateChanged>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.MultiplayerConnectionStateChanged>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class MultiplayerRoundEndEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.MultiplayerRoundEnd>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.MultiplayerRoundEnd>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class MultiplayerRoundStartEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.MultiplayerRoundStart>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.MultiplayerRoundStart>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class NpcPropertiesUpdatedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.NpcPropertiesUpdated>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.NpcPropertiesUpdated>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class OptionsUpdatedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.OptionsUpdated>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.OptionsUpdated>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class PerformanceMetricsEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.PerformanceMetrics>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.PerformanceMetrics>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class PlayerBouncedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.PlayerBounced>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.PlayerBounced>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class PlayerDiedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.PlayerDied>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.PlayerDied>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class PlayerJoinEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.PlayerJoin>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.PlayerJoin>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class PlayerLeaveEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.PlayerLeave>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.PlayerLeave>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class PlayerMessageEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.PlayerMessage>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.PlayerMessage>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }

  reply(message: RawText | string): Promise<Response>[] {
    return this.client.sendMessage(message, { target: this.data.sender });
  }

  get receiver(): string | undefined {
    const receiver = this.data.receiver;
    return receiver === "" ? undefined : receiver;
  }
}

export class PlayerTeleportedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.PlayerTeleported>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.PlayerTeleported>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class PlayerTransformEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.PlayerTransform>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.PlayerTransform>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class PlayerTravelledEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.PlayerTravelled>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.PlayerTravelled>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class PortalBuiltEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.PortalBuilt>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.PortalBuilt>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class PortalUsedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.PortalUsed>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.PortalUsed>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class PortfolioExportedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.PortfolioExported>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.PortfolioExported>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class PotionBrewedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.PotionBrewed>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.PotionBrewed>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class PurchaseAttemptEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.PurchaseAttempt>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.PurchaseAttempt>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class PurchaseResolvedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.PurchaseResolved>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.PurchaseResolved>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class RegionalPopupEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.RegionalPopup>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.RegionalPopup>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class RespondedToAcceptContentEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.RespondedToAcceptContent>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.RespondedToAcceptContent>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class ScreenChangedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.ScreenChanged>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.ScreenChanged>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class ScreenHeartbeatEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.ScreenHeartbeat>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.ScreenHeartbeat>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class SignInToEduEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.SignInToEdu>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.SignInToEdu>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class SignInToXboxLiveEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.SignInToXboxLive>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.SignInToXboxLive>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class SignOutOfXboxLiveEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.SignOutOfXboxLive>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.SignOutOfXboxLive>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class SpecialMobBuiltEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.SpecialMobBuilt>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.SpecialMobBuilt>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class StartClientEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.StartClient>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.StartClient>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class StartWorldEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.StartWorld>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.StartWorld>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class TextToSpeechToggledEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.TextToSpeechToggled>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.TextToSpeechToggled>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class UgcDownloadCompletedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.UgcDownloadCompleted>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.UgcDownloadCompleted>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class UgcDownloadStartedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.UgcDownloadStarted>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.UgcDownloadStarted>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class UploadSkinEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.UploadSkin>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.UploadSkin>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class VehicleExitedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.VehicleExited>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.VehicleExited>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class WorldExportedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.WorldExported>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.WorldExported>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class WorldFilesListedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.WorldFilesListed>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.WorldFilesListed>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class WorldGeneratedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.WorldGenerated>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.WorldGenerated>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class WorldLoadedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.WorldLoaded>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.WorldLoaded>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class WorldUnloadedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof event.WorldUnloaded>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof event.WorldUnloaded>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}
