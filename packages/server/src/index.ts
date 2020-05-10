import express from 'express';
import apiRouter from './routes';
import socket from 'socket.io';
import { Server } from 'http';
import { socket as socketRouter } from './socket';
import cors from 'cors';

const app = express();
const server = new Server(app);
const io = socket(server);
app.use(cors());
app.use(apiRouter);
socketRouter(io);

const port = process.env.PORT || '8081';

app.listen(port, err => {
    if (err) return console.error(err);
    return console.log(`Server is listening on ${port}`);
});