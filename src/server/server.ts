import * as express from 'express';
import apiRouter from './routes';
import * as socket from 'socket.io';
import { Server } from 'http';
import { socket as socketRouter } from './socket';

const app = express();
const server = new Server(app);
const io = socket(server);

const port = process.env.PORT || 8080;
server.listen(port, () => console.log(`Server listening on port: ${port}`));

app.use(express.static('public'));
app.use(apiRouter);

socketRouter(io);