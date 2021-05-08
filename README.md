# RaspberryCAN
A Node.JS application for reading and displaying vehicle information using a linux CAN interface. This is designed for Raspberry Pi, but it can run on other linux systems if a CAN interface is set up.

Internally, this system is being used on a [Raspberry Pi Zero W](https://www.raspberrypi.org/products/raspberry-pi-zero-w/) and a 2011 Nissan Leaf.

## Installation
Make sure you have Node.JS and NPM installed, then run:
1. `npm i --production` to install the required dependencies.
2. `npm run start` to run the application.

## Configuration
You can edit the config.json file to change the behaviour of the application. All valid config entries are listed below.
| Entry | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| name | string | RaspberryCAN | The title of the web interface. |
| port | number | 8080 | The port of the web interface and websocket. |
| can_interface | string | can0 | The name of the linux CAN interface to use. |
| definition | string | null | The vehicle CAN definition for the application to use. |
| gps_port | string | null | The serial port of a GPS module (still in development). |

## Other Information

### Compiling
1. Run `npm i` to install ALL of the dependencies
2. You can use `npm run compile-app` to compile the app code.
3. You can use `npm run compile-web` to compile the web interface code.
4. You can use `npm run compile-prod` to compile ALL of the code for production.

*Note: The project comes pre-compiled as the Raspberry Pi takes a long time to compile on it's own.*

### My Setup
I'm using a MCP2515 module for my CAN interface, you can find a diagram of my wiring setup [here](/extra/wiring.png). I used [this forum post](https://www.raspberrypi.org/forums/viewtopic.php?t=141052) to separate the 3.3v and 5v inputs (the extra pin on my diagram is the 5v input).

I added the CAN interface to Raspbian with the help of [this tutorial](https://www.beyondlogic.org/adding-can-controller-area-network-to-the-raspberry-pi/).
