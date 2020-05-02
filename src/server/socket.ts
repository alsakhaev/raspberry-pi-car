import { Server } from "socket.io";
import { Car } from './car';

const car = new Car();

export function socket(io: Server) {
    io.on('connection', (socket) => {
        socket.on('car/driver/forward', () => car.driver.forward());
        socket.on('car/driver/backward', () => car.driver.backward());
        socket.on('car/driver/left', () => car.driver.left());
        socket.on('car/driver/right', () => car.driver.right());
        socket.on('car/driver/stop', () => car.driver.stop());
    });
}