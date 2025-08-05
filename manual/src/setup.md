# Setup

The next chapter will discuss how to get started but before we can program
the WebSocket server, we first need to take some steps.

Note, that WebSocket connections cannot be established on consoles.

In the settings navigate to General > General and turn on "Websockets Enabled"
and turn off "Require Encrypted Websockets".

If you run the WebSocket server locally which is usually the case you may need
to disable the firewall if you run Minecraft on a different device in the same
network. If you are on Windows, run this PowerShell command with admin
privileges:

```powershell
CheckNetIsolation LoopbackExempt -a -n="Microsoft.MinecraftUWP_8wekyb3d8bbwe"
```


## Establishing a Connection to Console Hosted World

Consoles do not support WebSocket connections but mobile and desktop devices do.
To establish a WebSocket on a world hosted on console, you need an additional
mobile or desktop device (or a friend that has one) that has Minecraft on it.
This device can join the world hosted on the console and then connect to the
WebSocket server.
