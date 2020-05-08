import * as express from 'express';
import apiRouter from './routes';
import * as socket from 'socket.io';
import { Server } from 'http';
import { socket as socketRouter } from './socket';
import RpiServer from './camera/raspivid';

function runCarServer() {
    const app = express();
    const server = new Server(app);
    const io = socket(server);
    const port = 8080;
    server.listen(port, () => console.log(`Car server listening on port: ${port}`));
    app.use(express.static('public'));
    app.use(apiRouter);
    socketRouter(io);
}

function runCameraServer() {
    const app = express();
    const server = new Server(app);
    const silent = new RpiServer(server);
    const port = 8081;
    server.listen(port, () => console.log(`Camera server listening on port: ${port}`));    
}

runCarServer();
runCameraServer();