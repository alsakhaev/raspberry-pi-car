import { Server } from "socket.io";
import { Car } from './car';

const car = new Car();

export function socket(io: Server) {
    io.on('connection', (socket) => {
        socket.on('car/driver/forward', (speed) => car.driver.forward(speed));
        socket.on('car/driver/forward-left', (speed) => car.driver.forwardLeft(speed));
        socket.on('car/driver/forward-right', (speed) => car.driver.forwardRight(speed));
        socket.on('car/driver/backward', (speed) => car.driver.backward(speed));
        socket.on('car/driver/backward-left', (speed) => car.driver.backwardLeft(speed));
        socket.on('car/driver/backward-right', (speed) => car.driver.backwardRight(speed));
        socket.on('car/driver/left', (speed) => car.driver.left(speed));
        socket.on('car/driver/right', (speed) => car.driver.right(speed));
        socket.on('car/driver/stop', () => car.driver.stop());
    });
}