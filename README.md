# Raspberry Pi Car

A four-wheel drive car based on Raspberry Pi board.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Install and run [rpi-webrtc-streamer](https://github.com/kclyu/rpi-webrtc-streamer) for camera streaming via WebRTC.

You can use deb packages from [this repository](https://github.com/kclyu/rpi-webrtc-streamer-deb).

```
sudo apt update
sudo apt full-upgrade
sudo dpkg -i rws_xxx_armhf.deb
sudo systemctl start rws
```

### Installing

Clone this repo to your Raspberry Pi
```
git clone https://github.com/alsakhaev/raspberry-pi-car.git
cd raspberry-pi-car
```

Install all NPM dependencies
```
npm install
```

Run [pigpio](https://github.com/fivdi/pigpio) daemon at 8082 port
```
sudo pigpiod -p 8082
```

Build and run production bundle
```
npm run start:prod
```

Or build and run development bundle in watching mode
```
npm run start
```

### Port Forwarding

For external remote control via Internet, probably you will need to configure port forwarding in your router. The following table describes ports using and its purposes.

| Port | Description                         |
| ---- | ----------------------------------- |
| 8080 | Web client                          |
| 8081 | Node.js based API                   |
| 8888 | WebRTC Streaming Direct Port of RWS |
| 8889 | WebSocket signaling server of RWS   |

## Project Structure

- `packages/client` - React.js based web client
- `packages/server` - Node.js based WebSocket API for car control

## Built With

### Hardware

* Raspberry Pi 3B+
* Raspberry Pi Camera Module v2
* L298N Dual H-bridge Motor Driver Board
* 4WD Car Platform

### Software

* [TypeScript](https://www.typescriptlang.org/)
* [Node.js](https://nodejs.org/)
* [rpi-webrtc-streamer](https://github.com/kclyu/rpi-webrtc-streamer)
* [pigpio](https://github.com/fivdi/pigpio)

## Authors

* Alexander Sakhaev

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
