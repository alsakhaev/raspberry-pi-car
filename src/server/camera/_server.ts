"use strict";


const WebSocketServer = require('ws').Server;
const Splitter        = require('stream-split');
const merge           = require('mout/object/merge');

const NALseparator    = new Buffer([0,0,0,1]);//NAL break


export default class _Server {
  options: any;
  wss: any;
  readStream: any;

  constructor(server: any, options: any) {

    this.options = merge({
        width : 960,
        height: 540,
    }, options);

    this.wss = new WebSocketServer({ server });

    this.new_client = this.new_client.bind(this);
    this.start_feed = this.start_feed.bind(this);
    this.broadcast  = this.broadcast.bind(this);

    this.wss.on('connection', this.new_client);
  }
  

  start_feed() {
    this.readStream = this.get_feed();
    this.readStream = this.readStream.pipe(new Splitter(NALseparator));
    this.readStream.on("data", this.broadcast);
  }

  get_feed() {
    throw new Error("to be implemented");
  }

  broadcast(data: any) {
    this.wss.clients.forEach(function(socket: any) {

      if(socket.buzy)
        return;

      socket.buzy = true;
      socket.buzy = false;

      socket.send(Buffer.concat([NALseparator, data]), { binary: true}, function ack(error: any) {
        socket.buzy = false;
      });
    });
  }

  new_client(socket: any) {
  
    var self = this;
    console.log('New guy');

    socket.send(JSON.stringify({
      action : "init",
      width  : this.options.width,
      height : this.options.height,
    }));

    socket.on("message", function(data: any){
      var cmd = "" + data, action = data.split(' ')[0];
      console.log("Incomming action '%s'", action);

      if(action == "REQUESTSTREAM")
        self.start_feed();
      if(action == "STOPSTREAM")
        self.readStream.pause();
    });

    socket.on('close', function() {
      self.readStream.end();
      console.log('stopping client interval');
    });
  }
};