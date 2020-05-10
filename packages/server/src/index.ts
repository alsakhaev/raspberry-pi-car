import express from 'express';
import socket from 'socket.io';
import { Server } from 'http';
import { socket as socketRouter } from './socket';
import cors from 'cors';

const app = express();
const server = new Server(app);
const io = socket(server);

server.listen(8081);

io.origins('*:*');
app.use(cors());
socketRouter(io);