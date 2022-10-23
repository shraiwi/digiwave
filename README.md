# digiwave
A website that turns a group of smartphones into a lightshow!

[Client App](https://shraiwi.github.io/digiwave/client/) (broken without websocket server)

[Shader Editor](https://www.shadertoy.com/view/DsXGRf)

## Overview

### System Architecture

To minimize server-side processing, we took inspiration from a GPU, where multiple shader cores run shared programs in parallel. Once assigned a position, every client runs a program analogous to a fragment shader to calculate the flashlight state, eliminating the need for server-side animation.

When a controller sends a `set_command` packet to the server, the server relays the `command` field to all of the clients. The `command` is run by all of the clients. For example, the `blink` command uses the following expression:

```js
(time % 2.0) > 1.0
```

Since the `time` field is reset by all the clients when the command is recieved, all the clients should blink in sync (barring latency). The shader has additional fields, including normalized x and y coordinates for location-based effects. 

This architecture massively reduces the processing requirements for the server, allowing it to simply relay what commands to play and when to all of the clients, without having to deal with actually toggling each individual pixel. 

### Controller API

To become a admin, simply send a packet with the following format:

```json
{
    "type": "promote",
    "password": <server password>,
}
```

Then any `set_command` packets sent from the promoted webocket will be relayed to the clients.

### Project structure
The project structure is as follows:

- `server/` contains the code for the server that will:
    - serve the digiwave webpage to smartphones
    - send position and command data to the smartphones
- `client/` contains the code for the smartphone client app that will:
    - send data (such as seat number) to the server
    - receive commands and position data from the server
- `controller/` contains the code for the controller that will:
    - determine the position of phones
    - receive input to dispatch commands to the server
    - help preview the commands (to make them easy to write)
