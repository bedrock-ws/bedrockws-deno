// TODO: factor out to separate lib using zod or standardschema.dev
// TODO: all events

import type Server from "./Server.ts";
import type Client from "./Client.ts";
import type { RawText } from "@minecraft/server";

/** Names of events the server can trigger. */
export interface ServerEvent {
  ready: (event: ReadyEvent) => void;
}

/** Names of events the client can trigger. */
export interface ClientEvent {
  connect: (event: ConnectEvent) => void;
  disconnect: (event: unknown) => void;
}

/** Names of events the game can trigger. */
export interface GameEvent {
  additionalContentLoaded: (event: AdditionalContentLoadedEvent) => void;
  agentCommand: (event: unknown) => void;
  agentCreated: (event: unknown) => void;
  apiInit: (event: unknown) => void;
  appPaused: (event: unknown) => void;
  appResumed: (event: unknown) => void;
  appSuspended: (event: unknown) => void;
  awardAchievement: (event: unknown) => void;
  blockBroken: (event: unknown) => void;
  blockPlaced: (event: unknown) => void;
  boardTextUpdated: (event: unknown) => void;
  bossKilled: (event: unknown) => void;
  cameraUsed: (event: unknown) => void;
  cauldronUsed: (event: unknown) => void;
  configurationChanged: (event: unknown) => void;
  connectionFailed: (event: unknown) => void;
  craftingSessionCompleted: (event: unknown) => void;
  endOfDay: (event: unknown) => void;
  entitySpawned: (event: unknown) => void;
  fileTransmissionCancelled: (event: unknown) => void;
  fileTransmissionCompleted: (event: unknown) => void;
  fileTransmissionStarted: (event: unknown) => void;
  firstTimeClientOpen: (event: unknown) => void;
  focusGained: (event: unknown) => void;
  focusLost: (event: unknown) => void;
  gameSessionComplete: (event: unknown) => void;
  gameSessionStart: (event: unknown) => void;
  hardwareInfo: (event: unknown) => void;
  hasNewContent: (event: unknown) => void;
  itemAcquired: (event: unknown) => void;
  itemCrafted: (event: unknown) => void;
  itemDestroyed: (event: unknown) => void;
  itemDropped: (event: unknown) => void;
  itemEnchanted: (event: unknown) => void;
  itemSmelted: (event: unknown) => void;
  itemUsed: (event: ItemUsedEvent) => void;
  joinCanceled: (event: unknown) => void;
  jukeboxUsed: (event: unknown) => void;
  licenseCensus: (event: unknown) => void;
  mascotCreated: (event: unknown) => void;
  menuShown: (event: unknown) => void;
  mobInteracted: (event: unknown) => void;
  mobKilled: (event: MobKilledEvent) => void;
  multiplayerConnectionStateChanged: (event: unknown) => void;
  multiplayerRoundEnd: (event: unknown) => void;
  multiplayerRoundStart: (event: unknown) => void;
  npcPropertiesUpdated: (event: unknown) => void;
  optionsUpdated: (event: unknown) => void;
  performanceMetrics: (event: unknown) => void;
  playerBounced: (event: PlayerBouncedEvent) => void;
  playerDied: (event: unknown) => void;
  playerJoin: (event: unknown) => void;
  playerLeave: (event: unknown) => void;
  playerMessage: (event: PlayerMessageEvent) => void;
  playerTeleported: (event: PlayerTeleportedEvent) => void;
  playerTransform: (event: PlayerTransformEvent) => void;
  playerTravelled: (event: PlayerTravelledEvent) => void;
  portalBuilt: (event: unknown) => void;
  portalUsed: (event: unknown) => void;
  portfolioExported: (event: unknown) => void;
  potionBrewed: (event: unknown) => void;
  purchaseAttempt: (event: unknown) => void;
  purchaseResolved: (event: unknown) => void;
  regionalPopup: (event: unknown) => void;
  respondedToAcceptContent: (event: unknown) => void;
  screenChanged: (event: unknown) => void;
  screenHeartbeat: (event: unknown) => void;
  signInToEdu: (event: unknown) => void;
  signInToXboxLive: (event: unknown) => void;
  signOutOfXboxLive: (event: unknown) => void;
  specialMobBuilt: (event: unknown) => void;
  startClient: (event: unknown) => void;
  startWorld: (event: unknown) => void;
  textToSpeechToggled: (event: unknown) => void;
  ugcDownloadCompleted: (event: unknown) => void;
  ugcDownloadStarted: (event: unknown) => void;
  uploadSkin: (event: unknown) => void;
  vehicleExited: (event: unknown) => void;
  worldExported: (event: unknown) => void;
  worldFilesListed: (event: unknown) => void;
  worldGenerated: (event: unknown) => void;
  worldLoaded: (event: unknown) => void;
  worldUnloaded: (event: unknown) => void;
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

export interface AdditionalContentLoaded {}

export class AdditionalContentLoadedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: AdditionalContentLoaded;

  constructor(
    options: { server: Server; client: Client; data: AdditionalContentLoaded },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export interface PlayerMessage {
  /** The player name of the sender of the message. */
  sender: string;

  /** The message that got sent. */
  message: string;

  /**
   * The receiver of the message or an empty string if there is no particular
   * receiver.
   *
   * This is usually the player name targeted when using the `tell`/`w`/`msg`
   * or `tellraw` command.
   */
  receiver: string;

  /**
   * The medium used for transmitting the message.
   *
   * `"tell"` includes the commands `tell`, `w`, `msg`, and `tellraw`; `"say"`
   * includes the `say` commands and `"chat"` means that no command has been
   * used.
   */
  type: "chat" | "tell" | "say";
}

export class PlayerMessageEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: PlayerMessage;

  constructor(
    options: { server: Server; client: Client; data: PlayerMessage },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }

  // TODO: also allow rawtext as parameter
  reply(message: string, options?: ReplyOptions): void {
    if (options?.raw) {
      const rawText: RawText = {
        rawtext: [
          { text: message },
        ],
      };
      this.client.run(`tellraw ${this.data.sender} ${JSON.stringify(rawText)}`);
    }
    this.client.run(`tell ${this.data.sender} ${message}`);
  }
}

export interface ReplyOptions {
  raw: boolean;
}

export interface PlayerTravelled {
  isUnderwater: boolean;
  metersTravelled: number;
  newBiome: number;
  player: Player;

  /**
   * The method used for traveling.
   *
   * This is `5` for flying in creative mode, `2` for falling, `0` for
   * walking, `6` for riding (a minecart for example).
   */
  travelMethod: number;

  vehicle?: Entity;
}

export class PlayerTravelledEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: PlayerTravelled;

  constructor(
    options: { server: Server; client: Client; data: PlayerTravelled },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export interface PlayerTransform {
  player: Player;
}

export class PlayerTransformEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: PlayerTransform;

  constructor(
    options: { server: Server; client: Client; data: PlayerTransform },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export interface PlayerTeleported {
  /**
   * The metod used for teleporting.
   *
   * `1` means Ender Pearl, `2` means Chorus Fruit, `3` means `teleport`
   * command.
   */
  cause: number;

  itemType?: number;

  metersTravelled: number;
}

export class PlayerTeleportedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: PlayerTeleported;

  constructor(
    options: { server: Server; client: Client; data: PlayerTeleported },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export interface PlayerBounced {
  block: {
    aux: number;
    id: string;
    namespace: string;
  };
  bounceHeight: number;
  player: Player;
}

export class PlayerBouncedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: PlayerBounced;

  constructor(
    options: { server: Server; client: Client; data: PlayerBounced },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export interface ItemUsed {
  count: number;
  item: {
    aux: number;
    id: string;
    namespace: string;
  };
  player: Player;

  /**
   * The method used to interact with the item.
   *
   * `1` means eating, `10` setting on fire.
   */
  useMethod: number;
}

export class ItemUsedEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: ItemUsed;

  constructor(
    options: { server: Server; client: Client; data: ItemUsed },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export interface MobKilled {
  armorBody: Item;
  armorFeet: Item;
  armorHead: Item;
  armorTorso: Item;
  isMonster: boolean;
  killMethodType: number;
  player: Player;
  playerIsHiddenFrom: boolean;
  victim: Entity;
  weapon: Item;
}

export class MobKilledEvent implements GameEventBase {
  server: Server;
  client: Client;
  data: MobKilled;

  constructor(
    options: { server: Server; client: Client; data: MobKilled },
  ) {
    this.server = options.server;
    this.client = options.client;
    this.data = options.data;
  }
}

export interface Player {
  /** A hex encoded color of form `RRGGBBAA`. */
  color: string;

  /**
   * The dimension the player is in.
   *
   * `0` means overworld, `1` mean nether and `2` means end dimension.
   */
  dimension: number;

  id: number;

  /** The name of the player. */
  name: string;

  /** The position of the player. */
  position: { x: number; y: number; z: number };

  /** Usually `"minecraft:player"`. */
  type: string;

  variant: number;

  yRot: number;
}

export interface Item {
  aux: 0;
  enchantments: unknown[]; // TODO
  freeStackSize: number;
  id: string;
  maxStackSize: number;
  namespace: string;
  stackSize: number;
}

export interface Entity {
  color: number;
  dimension: number;
  id: number;
  position: { x: number; y: number; z: number };
  /** Example: `"minecraft:minecart"`. */
  type: string;
  variant: number;
  yRot: number;
}
