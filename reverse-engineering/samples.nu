#!/usr/bin/env nu

# Dump samples responses of a certain event.
def main [event_name: string]: nothing -> nothing {
  let logs_path = "~/.cache/bedrockws-deno/" | path expand
  ls $logs_path
    | get name
    | each { open }
    | where header.messagePurpose == "event" and header.eventName == $event_name
}
