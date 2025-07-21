import type Server from "./Server.ts";
import type Client from "./Client.ts";
import type {
  AdditionalContentLoaded,
  ItemUsed,
  MobKilled,
  PlayerBounced,
  PlayerMessage,
  PlayerTeleported,
  PlayerTransform,
  PlayerTravelled,
} from "@bedrock-ws/schema/events";
import type { RawText } from "@minecraft/server";
import type { z } from "zod/v4";

/** Events the server can trigger. */
export interface ServerEvent {
  Ready: (event: ReadyEvent) => void;
}

/** Events the client can trigger. */
export interface ClientEvent {
  Connect: (event: ConnectEvent) => void;
  Disconnect: (event: unknown) => void;
}

/** Events the game can trigger. */
export interface GameEvent {
  AdditionalContentLoaded: (event: AdditionalContentLoadedEvent) => void;
  AgentCommand: (event: unknown) => void;
  AgentCreated: (event: unknown) => void;
  ApiInit: (event: unknown) => void;
  AppPaused: (event: unknown) => void;
  AppResumed: (event: unknown) => void;
  AppSuspended: (event: unknown) => void;
  AwardAchievement: (event: unknown) => void;
  BlockBroken: (event: unknown) => void;
  BlockPlaced: (event: unknown) => void;
  BoardTextUpdated: (event: unknown) => void;
  BossKilled: (event: unknown) => void;
  CameraUsed: (event: unknown) => void;
  CauldronUsed: (event: unknown) => void;
  ConfigurationChanged: (event: unknown) => void;
  ConnectionFailed: (event: unknown) => void;
  CraftingSessionCompleted: (event: unknown) => void;
  EndOfDay: (event: unknown) => void;
  EntitySpawned: (event: unknown) => void;
  FileTransmissionCancelled: (event: unknown) => void;
  FileTransmissionCompleted: (event: unknown) => void;
  FileTransmissionStarted: (event: unknown) => void;
  FirstTimeClientOpen: (event: unknown) => void;
  FocusGained: (event: unknown) => void;
  FocusLost: (event: unknown) => void;
  GameSessionComplete: (event: unknown) => void;
  GameSessionStart: (event: unknown) => void;
  HardwareInfo: (event: unknown) => void;
  HasNewContent: (event: unknown) => void;
  ItemAcquired: (event: unknown) => void;
  ItemCrafted: (event: unknown) => void;
  ItemDestroyed: (event: unknown) => void;
  ItemDropped: (event: unknown) => void;
  ItemEnchanted: (event: unknown) => void;
  ItemSmelted: (event: unknown) => void;
  ItemUsed: (event: ItemUsedEvent) => void;
  JoinCanceled: (event: unknown) => void;
  JukeboxUsed: (event: unknown) => void;
  LicenseCensus: (event: unknown) => void;
  MascotCreated: (event: unknown) => void;
  MenuShown: (event: unknown) => void;
  MobInteracted: (event: unknown) => void;
  MobKilled: (event: MobKilledEvent) => void;
  MultiplayerConnectionStateChanged: (event: unknown) => void;
  MultiplayerRoundEnd: (event: unknown) => void;
  MultiplayerRoundStart: (event: unknown) => void;
  NpcPropertiesUpdated: (event: unknown) => void;
  OptionsUpdated: (event: unknown) => void;
  PerformanceMetrics: (event: unknown) => void;
  PlayerBounced: (event: PlayerBouncedEvent) => void;
  PlayerDied: (event: unknown) => void;
  PlayerJoin: (event: unknown) => void;
  PlayerLeave: (event: unknown) => void;
  PlayerMessage: (event: PlayerMessageEvent) => void;
  PlayerTeleported: (event: PlayerTeleportedEvent) => void;
  PlayerTransform: (event: PlayerTransformEvent) => void;
  PlayerTravelled: (event: PlayerTravelledEvent) => void;
  PortalBuilt: (event: unknown) => void;
  PortalUsed: (event: unknown) => void;
  PortfolioExported: (event: unknown) => void;
  PotionBrewed: (event: unknown) => void;
  PurchaseAttempt: (event: unknown) => void;
  PurchaseResolved: (event: unknown) => void;
  RegionalPopup: (event: unknown) => void;
  RespondedToAcceptContent: (event: unknown) => void;
  ScreenChanged: (event: unknown) => void;
  ScreenHeartbeat: (event: unknown) => void;
  SignInToEdu: (event: unknown) => void;
  SignInToXboxLive: (event: unknown) => void;
  SignOutOfXboxLive: (event: unknown) => void;
  SpecialMobBuilt: (event: unknown) => void;
  StartClient: (event: unknown) => void;
  StartWorld: (event: unknown) => void;
  TextToSpeechToggled: (event: unknown) => void;
  UgcDownloadCompleted: (event: unknown) => void;
  UgcDownloadStarted: (event: unknown) => void;
  UploadSkin: (event: unknown) => void;
  VehicleExited: (event: unknown) => void;
  WorldExported: (event: unknown) => void;
  WorldFilesListed: (event: unknown) => void;
  WorldGenerated: (event: unknown) => void;
  WorldLoaded: (event: unknown) => void;
  WorldUnloaded: (event: unknown) => void;
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

export class AdditionalContentLoadedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof AdditionalContentLoaded>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof AdditionalContentLoaded>;
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
  data: z.infer<typeof PlayerMessage>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof PlayerMessage>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }

  reply(message: RawText | string) {
    const rawText: RawText = typeof message === "string"
      ? { rawtext: [{ text: message }] }
      : message;
    this.client.run(`tellraw ${this.data.sender} ${JSON.stringify(rawText)}`);
  }
}

export class PlayerTravelledEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof PlayerTravelled>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof PlayerTravelled>;
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
  data: z.infer<typeof PlayerTransform>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof PlayerTransform>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class PlayerTeleportedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof PlayerTeleported>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof PlayerTeleported>;
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
  data: z.infer<typeof PlayerBounced>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof PlayerBounced>;
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
  data: z.infer<typeof ItemUsed>;

  constructor(
    options: { server: Server; client: Client; data: z.infer<typeof ItemUsed> },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export class MobKilledEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: z.infer<typeof MobKilled>;

  constructor(
    options: {
      server: Server;
      client: Client;
      data: z.infer<typeof MobKilled>;
    },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}
