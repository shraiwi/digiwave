# digiwave
A website that turns a group of smartphones into a lightshow

## Overview
The project structure is as follows:

- `server/` contains the code for the server that will:
    - serve the digiwave webpage to smartphones
    - send position and command data to the smartphones
- `server/client/` contains the code for the smartphone client app that will:
    - send data (such as seat number) to the server
    - receive commands and position data from the server
- `controller/` contains the code for the controller that will:
    - determine the position of phones
    - receive input to dispatch commands to the server
    - help preview the commands (to make them easy to write)