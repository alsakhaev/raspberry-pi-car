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

1. Clone repo
2. `npm install` to install all dependencies
3. `npm run start:prod` to build and run production bundle or `npm run start` to run watch development mode

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

## Authors

* Alexander Sakhaev

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
