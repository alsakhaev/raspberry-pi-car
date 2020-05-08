import * as util from 'util';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { Server as WebSocketServer } from 'ws';
const Splitter = require('stream-split');

const NALseparator = new Buffer([0, 0, 0, 1]);//NAL break

export default class RpiServer {

  options: { width: number, height: number, fps: number };
  wss: WebSocketServer;
  streamer: ChildProcessWithoutNullStreams;

  constructor(server: any) {

    this.options = {
      width: 960,
      height: 540,
      fps: 12
    };

    this.wss = new WebSocketServer({ server });

    this.new_client = this.new_client.bind(this);
    this.start_feed = this.start_feed.bind(this);
    this.broadcast = this.broadcast.bind(this);

    this.wss.on('connection', this.new_client);
  }

  broadcast(data: any) {
    this.wss.clients.forEach(function (socket: any) {
      if (socket.buzy)
        return;

      socket.buzy = true;
      socket.buzy = false;

      socket.send(Buffer.concat([NALseparator, data]), { binary: true }, function ack(error: any) {
        socket.buzy = false;
      });
    });
  }

  new_client(socket: any) {

    var self = this;
    console.log('New guy');

    socket.send(JSON.stringify({
      action: "init",
      width: this.options.width,
      height: this.options.height,
    }));

    socket.on("message", function (data: any) {
      var cmd = "" + data, action = data.split(' ')[0];
      console.log("Incomming action '%s'", action);

      if (action == "REQUESTSTREAM")
        self.start_feed();
      if (action == "STOPSTREAM")
        self.streamer.stdout.pause();
    });

    socket.on('close', function () {
      self.streamer.stdin.end();
      console.log('stopping client interval');
    });
  }

  
  start_feed() {
    this.streamer = this.get_feed();
    const readStream = this.streamer.stdout.pipe(new Splitter(NALseparator));
    readStream.on("data", this.broadcast);
  }

  get_feed() {
    var msk = "raspivid -t 0 -o - -w %d -h %d -fps -rot 180 %d";
    var cmd = util.format(msk, this.options.width, this.options.height, this.options.fps);
    console.log(cmd);
    var streamer = spawn('raspivid', ['-t', '0', '-o', '-', '-w', this.options.width.toString(), '-h', this.options.height.toString(), '-fps', this.options.fps.toString(), '-rot', '180', '-pf', 'baseline']);
    streamer.on("exit", function (code: any) {
      console.log("Failure", code);
    });

    return streamer;
  }
};