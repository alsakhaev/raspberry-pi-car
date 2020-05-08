"use strict";

const util      = require('util');
const spawn     = require('child_process').spawn;
const merge     = require('mout/object/merge');

const Server    = require('./_server');


export default class RpiServer extends Server {

  constructor(server: any, opts?: any) {
    super(server, merge({
      fps : 12,
    }, opts));
  }

  get_feed() {
    var msk = "raspivid -t 0 -o - -w %d -h %d -fps -rot 180 %d";
    var cmd = util.format(msk, this.options.width, this.options.height, this.options.fps);
    console.log(cmd);
    var streamer = spawn('raspivid', ['-t', '0', '-o', '-', '-w', this.options.width, '-h', this.options.height, '-fps', this.options.fps, '-rot', '180', '-pf', 'baseline']);
    streamer.on("exit", function(code: any){
      console.log("Failure", code);
    });

    return streamer.stdout;
  }
};