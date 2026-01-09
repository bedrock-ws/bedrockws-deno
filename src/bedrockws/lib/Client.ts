import { Semaphore } from "@asyncio/sync/semaphore";
import * as consts from "./consts.ts";
import type { GameEvent } from "./events.ts";
import {
  AdditionalContentLoadedEvent,
  AgentCommandEvent,
  AgentCreatedEvent,
  ApiInitEvent,
  AppPausedEvent,
  AppResumedEvent,
  AppSuspendedEvent,
  AwardAchievementEvent,
  BlockBrokenEvent,
  BlockPlacedEvent,
  BoardTextUpdatedEvent,
  BossKilledEvent,
  CameraUsedEvent,
  CauldronUsedEvent,
  ConfigurationChangedEvent,
  ConnectionFailedEvent,
  CraftingSessionCompletedEvent,
  EndOfDayEvent,
  EntitySpawnedEvent,
  FileTransmissionCancelledEvent,
  FileTransmissionCompletedEvent,
  FileTransmissionStartedEvent,
  FirstTimeClientOpenEvent,
  FocusGainedEvent,
  FocusLostEvent,
  GameSessionCompleteEvent,
  GameSessionStartEvent,
  HardwareInfoEvent,
  HasNewContentEvent,
  ItemAcquiredEvent,
  ItemCraftedEvent,
  ItemDestroyedEvent,
  ItemDroppedEvent,
  ItemEnchantedEvent,
  ItemSmeltedEvent,
  ItemUsedEvent,
  JoinCanceledEvent,
  JukeboxUsedEvent,
  LicenseCensusEvent,
  MascotCreatedEvent,
  MenuShownEvent,
  MobInteractedEvent,
  MobKilledEvent,
  MultiplayerConnectionStateChangedEvent,
  MultiplayerRoundEndEvent,
  MultiplayerRoundStartEvent,
  NpcPropertiesUpdatedEvent,
  OptionsUpdatedEvent,
  PerformanceMetricsEvent,
  PlayerBouncedEvent,
  PlayerDiedEvent,
  PlayerJoinEvent,
  PlayerLeaveEvent,
  PlayerMessageEvent,
  PlayerTeleportedEvent,
  PlayerTransformEvent,
  PlayerTravelledEvent,
  PortalBuiltEvent,
  PortalUsedEvent,
  PortfolioExportedEvent,
  PotionBrewedEvent,
  PurchaseAttemptEvent,
  PurchaseResolvedEvent,
  RegionalPopupEvent,
  RespondedToAcceptContentEvent,
  ScreenChangedEvent,
  ScreenHeartbeatEvent,
  SignInToEduEvent,
  SignInToXboxLiveEvent,
  SignOutOfXboxLiveEvent,
  SpecialMobBuiltEvent,
  StartClientEvent,
  StartWorldEvent,
  TextToSpeechToggledEvent,
  UgcDownloadCompletedEvent,
  UgcDownloadStartedEvent,
  UploadSkinEvent,
  VehicleExitedEvent,
  WorldExportedEvent,
  WorldFilesListedEvent,
  WorldGeneratedEvent,
  WorldLoadedEvent,
  WorldUnloadedEvent,
} from "./events.ts";
import type { Request, Response, Server } from "@bedrock-ws/bedrockws";
import type { WebSocket } from "ws";
import type { RawText } from "@minecraft/server";
import type * as event from "@bedrock-ws/schema/events";
import type { CommandResponseWithDetails } from "@bedrock-ws/schema/response";
import { targetquery } from "@bedrock-ws/schema";
import type { z } from "zod/v4";

interface PendingRequest<O, E> {
  resolve: (value: O) => void;
  reject: (reason: E) => void;
}

const TargetQueryDetail = targetquery.TargetQueryDetails.unwrap();

/**
 * Additional options for {@link Client#run}.
 */
export interface RunOptions {
  /**
   * The Minecraft version the command syntax relies on.
   *
   * If omitted, this likely defaults to the current version of the client.
   */
  minecraftVersion?: string;
}

/**
 * Additional options for {@link Client#sendMessage}.
 */
export interface SendMessageOptions {
  /**
   * The target(s) who should receive the message.
   */
  target?: string;

  /**
   * Whether to split the message and send the parts separately.
   *
   * This is useful for large messages as the game can only handle a certain
   * message length. The output will not be altered as the implementation only
   * splits the message at line breaks. Two minor issues may raise from setting
   * this to `true`:
   * - more messages will be sent in total
   * - messages may appear in between the split message
   *
   * This is `true` by default.
   */
  split?: boolean;
}

/** Representation of a Minecraft client connected to the WebSocket server. */
export default class Client {
  /** The WebSocket connection with the server. */
  protected socket: WebSocket;

  /** The associated server. */
  server: Server;

  /**
   * The requests IDs of those sent to the Minecraft client that need to be
   * answered by it.
   */
  protected requests: Map<string, PendingRequest<Response, Response>>;

  /**
   * A sempahore which holds pending command requests to the Minecraft client.
   */
  protected commandSemaphore: Semaphore;

  constructor(socket: WebSocket, server: Server) {
    this.socket = socket;
    this.server = server;
    this.requests = new Map();
    this.commandSemaphore = new Semaphore(
      consts.maxCommandProcessing,
    );
  }

  /**
   * Closes the WebSocket connection.
   */
  close(options?: { code: number; reason: string }) {
    // FIXME: neither emits "close"/"disconnect" event nor makes Minecraft tell
    //        that the connection closed but no further events are triggered
    //        and the connection eventually closes with code 1006
    this.socket.close(options?.code, options?.reason);
  }

  /** Sends a request to the Minecraft client. */
  async send(req: Request): Promise<Response> {
    const requestId = req.header.requestId;

    // Send the request as soon as the queue has enough space.
    await this.commandSemaphore.acquire();
    const data = JSON.stringify(req);
    this.socket.send(data);

    return new Promise((resolve, reject) => {
      this.requests.set(requestId, { resolve, reject });
    });
  }

  /**
   * Sends a message in the chat.
   */
  sendMessage(
    message: RawText | string,
    options?: SendMessageOptions,
  ): Promise<Response>[] {
    const target = options?.target ?? "@a";
    const split = options?.split ?? true;
    // TODO: support splitting RawText
    const messages: RawText[] = [];
    if (split && typeof message === "string") {
      for (const msg of Client.splitMessage(message)) {
        messages.push({ rawtext: [{ text: msg }] });
      }
    } else {
      const rawText: RawText = typeof message === "string"
        ? { rawtext: [{ text: message }] }
        : message;
      messages.push(rawText);
    }
    // SECURITY: `target` may spread
    const promises = [];
    for (const msg of messages) {
      promises.push(this.run(`tellraw ${target} ${JSON.stringify(msg)}`));
    }
    return promises;
  }

  /**
   * Splits a message intended to be sent via chat such that the client's game
   * does not crash.
   *
   * Messages larger than around 456 characters appear to make the client' game
   * error and the world is left as a reaction.
   */
  private static splitMessage(message: string): string[] {
    // TODO: Currently, we use a dumb implementation. This should be improved
    //       such that we minimize the amount of messages to send. Extra
    //       attention is needed for style codes (`§a`, etc.): Styles must
    //       retain after line break!
    return message.split("\n").map((line) => line === "" ? "\n" : line);
  }

  /** Queries details of the client as a player in the world. */
  async queryPlayer(): Promise<z.infer<typeof TargetQueryDetail>> {
    const response = await this.run("querytarget @s");
    if (response.body === undefined || !("details" in response.body)) {
      throw new Error("unexpected response by querytarget command");
    }
    const { body } = response as Extract<
      z.infer<typeof CommandResponseWithDetails>,
      { "body": { "details": string } }
    >;
    const details: z.infer<typeof targetquery.TargetQueryDetails> = JSON
      .parse(
        body.details,
      );
    return details[0]; // only a single target is queried
  }

  /** Handles a response from the Minecraft client. */
  receive(res: Response) {
    const requestId = (res.header.messagePurpose === "commandResponse")
      ? res.header.requestId
      : undefined;
    const isError = !res.ok;
    const isResponse = res.header.messagePurpose === "commandResponse";
    if (isResponse && requestId !== undefined) {
      this.commandSemaphore.release();
      const maybeRequest = this.requests.get(requestId);
      if (maybeRequest !== undefined) {
        const { resolve, reject } = maybeRequest;
        if (isError) {
          reject(res);
        } else {
          resolve(res);
        }
      }
    }

    if (res.header.messagePurpose !== "event") return;

    const eventName = res.header.eventName;

    switch (eventName) {
      case "AdditionalContentLoaded": {
        const ev = new AdditionalContentLoadedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.AdditionalContentLoaded>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "AgentCommand": {
        const ev = new AgentCommandEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.AgentCommand>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "AgentCreated": {
        const ev = new AgentCreatedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.AgentCreated>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "ApiInit": {
        const ev = new ApiInitEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.ApiInit>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "AppPaused": {
        const ev = new AppPausedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.AppPaused>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "AppResumed": {
        const ev = new AppResumedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.AppResumed>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "AppSuspended": {
        const ev = new AppSuspendedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.AppSuspended>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "AwardAchievement": {
        const ev = new AwardAchievementEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.AwardAchievement>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "BlockBroken": {
        const ev = new BlockBrokenEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.BlockBroken>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "BlockPlaced": {
        const ev = new BlockPlacedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.BlockPlaced>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "BoardTextUpdated": {
        const ev = new BoardTextUpdatedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.BoardTextUpdated>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "BossKilled": {
        const ev = new BossKilledEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.BossKilled>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "CameraUsed": {
        const ev = new CameraUsedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.CameraUsed>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "CauldronUsed": {
        const ev = new CauldronUsedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.CauldronUsed>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "ConfigurationChanged": {
        const ev = new ConfigurationChangedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.ConfigurationChanged>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "ConnectionFailed": {
        const ev = new ConnectionFailedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.ConnectionFailed>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "CraftingSessionCompleted": {
        const ev = new CraftingSessionCompletedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.CraftingSessionCompleted>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "EndOfDay": {
        const ev = new EndOfDayEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.EndOfDay>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "EntitySpawned": {
        const ev = new EntitySpawnedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.EntitySpawned>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "FileTransmissionCancelled": {
        const ev = new FileTransmissionCancelledEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.FileTransmissionCancelled>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "FileTransmissionCompleted": {
        const ev = new FileTransmissionCompletedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.FileTransmissionCompleted>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "FileTransmissionStarted": {
        const ev = new FileTransmissionStartedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.FileTransmissionStarted>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "FirstTimeClientOpen": {
        const ev = new FirstTimeClientOpenEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.FirstTimeClientOpen>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "FocusGained": {
        const ev = new FocusGainedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.FocusGained>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "FocusLost": {
        const ev = new FocusLostEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.FocusLost>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "GameSessionComplete": {
        const ev = new GameSessionCompleteEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.GameSessionComplete>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "GameSessionStart": {
        const ev = new GameSessionStartEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.GameSessionStart>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "HardwareInfo": {
        const ev = new HardwareInfoEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.HardwareInfo>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "HasNewContent": {
        const ev = new HasNewContentEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.HasNewContent>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "ItemAcquired": {
        const ev = new ItemAcquiredEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.ItemAcquired>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "ItemCrafted": {
        const ev = new ItemCraftedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.ItemCrafted>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "ItemDestroyed": {
        const ev = new ItemDestroyedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.ItemDestroyed>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "ItemDropped": {
        const ev = new ItemDroppedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.ItemDropped>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "ItemEnchanted": {
        const ev = new ItemEnchantedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.ItemEnchanted>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "ItemSmelted": {
        const ev = new ItemSmeltedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.ItemSmelted>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "ItemUsed": {
        const ev = new ItemUsedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.ItemUsed>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "JoinCanceled": {
        const ev = new JoinCanceledEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.JoinCanceled>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "JukeboxUsed": {
        const ev = new JukeboxUsedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.JukeboxUsed>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "LicenseCensus": {
        const ev = new LicenseCensusEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.LicenseCensus>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "MascotCreated": {
        const ev = new MascotCreatedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.MascotCreated>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "MenuShown": {
        const ev = new MenuShownEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.MenuShown>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "MobInteracted": {
        const ev = new MobInteractedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.MobInteracted>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "MobKilled": {
        const ev = new MobKilledEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.MobKilled>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "MultiplayerConnectionStateChanged": {
        const ev = new MultiplayerConnectionStateChangedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<
            typeof event.MultiplayerConnectionStateChanged
          >,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "MultiplayerRoundEnd": {
        const ev = new MultiplayerRoundEndEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.MultiplayerRoundEnd>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "MultiplayerRoundStart": {
        const ev = new MultiplayerRoundStartEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.MultiplayerRoundStart>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "NpcPropertiesUpdated": {
        const ev = new NpcPropertiesUpdatedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.NpcPropertiesUpdated>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "OptionsUpdated": {
        const ev = new OptionsUpdatedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.OptionsUpdated>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "PerformanceMetrics": {
        const ev = new PerformanceMetricsEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.PerformanceMetrics>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "PlayerBounced": {
        const ev = new PlayerBouncedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.PlayerBounced>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "PlayerDied": {
        const ev = new PlayerDiedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.PlayerDied>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "PlayerJoin": {
        const ev = new PlayerJoinEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.PlayerJoin>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "PlayerLeave": {
        const ev = new PlayerLeaveEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.PlayerLeave>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "PlayerMessage": {
        const ev = new PlayerMessageEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.PlayerMessage>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "PlayerTeleported": {
        const ev = new PlayerTeleportedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.PlayerTeleported>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "PlayerTransform": {
        const ev = new PlayerTransformEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.PlayerTransform>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "PlayerTravelled": {
        const ev = new PlayerTravelledEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.PlayerTravelled>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "PortalBuilt": {
        const ev = new PortalBuiltEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.PortalBuilt>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "PortalUsed": {
        const ev = new PortalUsedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.PortalUsed>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "PortfolioExported": {
        const ev = new PortfolioExportedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.PortfolioExported>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "PotionBrewed": {
        const ev = new PotionBrewedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.PotionBrewed>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "PurchaseAttempt": {
        const ev = new PurchaseAttemptEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.PurchaseAttempt>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "PurchaseResolved": {
        const ev = new PurchaseResolvedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.PurchaseResolved>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "RegionalPopup": {
        const ev = new RegionalPopupEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.RegionalPopup>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "RespondedToAcceptContent": {
        const ev = new RespondedToAcceptContentEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.RespondedToAcceptContent>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "ScreenChanged": {
        const ev = new ScreenChangedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.ScreenChanged>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "ScreenHeartbeat": {
        const ev = new ScreenHeartbeatEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.ScreenHeartbeat>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "SignInToEdu": {
        const ev = new SignInToEduEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.SignInToEdu>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "SignInToXboxLive": {
        const ev = new SignInToXboxLiveEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.SignInToXboxLive>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "SignOutOfXboxLive": {
        const ev = new SignOutOfXboxLiveEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.SignOutOfXboxLive>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "SpecialMobBuilt": {
        const ev = new SpecialMobBuiltEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.SpecialMobBuilt>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "StartClient": {
        const ev = new StartClientEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.StartClient>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "StartWorld": {
        const ev = new StartWorldEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.StartWorld>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "TextToSpeechToggled": {
        const ev = new TextToSpeechToggledEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.TextToSpeechToggled>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "UgcDownloadCompleted": {
        const ev = new UgcDownloadCompletedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.UgcDownloadCompleted>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "UgcDownloadStarted": {
        const ev = new UgcDownloadStartedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.UgcDownloadStarted>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "UploadSkin": {
        const ev = new UploadSkinEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.UploadSkin>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "VehicleExited": {
        const ev = new VehicleExitedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.VehicleExited>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "WorldExported": {
        const ev = new WorldExportedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.WorldExported>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "WorldFilesListed": {
        const ev = new WorldFilesListedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.WorldFilesListed>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "WorldGenerated": {
        const ev = new WorldGeneratedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.WorldGenerated>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "WorldLoaded": {
        const ev = new WorldLoadedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.WorldLoaded>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      case "WorldUnloaded": {
        const ev = new WorldUnloadedEvent({
          server: this.server,
          client: this,
          data: res.body as z.infer<typeof event.WorldUnloaded>,
        });
        this.server.emit(res.header.eventName, ev);
        break;
      }
      default:
        throw eventName satisfies never;
    }
  }

  /**
   * Runs a command as the Minecraft client.
   *
   * The command should not include the slash prefix.
   */
  run(command: string, options?: RunOptions): Promise<Response> {
    const identifier = crypto.randomUUID();
    return this.send({
      header: {
        version: 1,
        requestId: identifier,
        messageType: "commandRequest",
        messagePurpose: "commandRequest",
      },
      body: {
        version: options?.minecraftVersion,
        commandLine: command,
        origin: {
          type: "player",
        },
      },
    });
  }

  /** Subscribes to a client's event. */
  subscribe(eventName: keyof GameEvent): Promise<Response> {
    const identifier = crypto.randomUUID();
    return this.send({
      header: {
        version: 1,
        requestId: identifier,
        messageType: "commandRequest",
        messagePurpose: "subscribe",
      },
      body: {
        eventName: eventName,
      },
    });
  }
}
