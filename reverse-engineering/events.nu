#!/usr/bin/env nu

# This is a list of events where the schema is unknown.
let unknown_events = [
  "AdditionalContentLoaded"
  "AgentCommand"
  "AgentCreated"
  "ApiInit"
  "AppPaused"
  "AppResumed"
  "AppSuspended"
  "AwardAchievement"
  "BoardTextUpdated"
  "BossKilled"
  "CameraUsed"
  "CauldronUsed"
  "ConfigurationChanged"
  "ConnectionFailed"
  "CraftingSessionCompleted"
  "EntitySpawned"
  "FileTransmissionCancelled"
  "FileTransmissionCompleted"
  "FirstTimeClientOpen"
  "FocusGained"
  "FocusLost"
  "GameSessionComplete"
  "GameSessionStart"
  "HardwareInfo"
  "HasNewContent"
  "ItemAcquired"
  "ItemCrafted"
  "ItemDestroyed"
  "ItemEnchanted"
  "JoinCanceled"
  "JukeboxUsed"
  "LicenseCensus"
  "MascotCreated"
  "MenuShown"
  "MobInteracted"
  "MultiplayerConnectionStateChanged"
  "MultiplayerRoundEnd"
  "MultiplayerRoundStart"
  "NpcPropertiesUpdated"
  "OptionsUpdated"
  "PerformanceMetrics"
  "PlayerJoin"
  "PlayerLeave"
  "PortalBuilt"
  "PortalUsed"
  "PortfolioExported"
  "PotionBrewed"
  "PurchaseAttempt"
  "PurchaseResolved"
  "RegionalPopup"
  "RespondedToAcceptContent"
  "ScreenChanged"
  "ScreenHeartbeat"
  "SignInToEdu"
  "SignInToXboxLive"
  "SignOutOfXboxLive"
  "SpecialMobBuilt"
  "StartClient"
  "StartWorld"
  "TextToSpeecToggled"
  "UgcDownloadCompleted"
  "UgcDownloadStarted"
  "UploadSkin"
  "VehicleExited"
  "WorldExported"
  "WorldFilesListed"
  "WorldGenerated"
  "WorldLoaded"
  "WorldUnloaded"
]

let logs_path = "~/.cache/bedrockws-deno/" | path expand
let data_of_interest = ls $logs_path
  | get name
  | each { open }
  | where header.eventName in $unknown_events
if ($data_of_interest | is-not-empty) {
  let output_file_name = "revealed_event_schemas.json"
  $data_of_interest | to json | save $output_file_name
  print $"Discovered new schemas! If you want to support the development of this
project, open an issue at github.com/bedrock-ws/bedrockws-deno with the contents
of the file ($output_file_name) or the file itself or alternatively send an
email to bedrock-ws@proton.me"
}
