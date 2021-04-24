var Mpeg1Muxer, child_process, events, util;

child_process = require('child_process');

util = require('util');

events = require('events');
var count1 = 0;
var count2 = 0;
var count3 = 0;
var count4 = 0;
Mpeg1Muxer = function(options) {
  var key;
  this.url = options.url;
  this.ffmpegOptions = options.ffmpegOptions;
  this.exitCode = undefined;
  this.additionalFlags = [];
  if (this.ffmpegOptions) {
    for (key in this.ffmpegOptions) {
      this.additionalFlags.push(key);
      if (String(this.ffmpegOptions[key]) !== '') {
        this.additionalFlags.push(String(this.ffmpegOptions[key]));
      }
    }
  }
  this.spawnOptions = [
    '-rtsp_transport',
    'tcp',
    '-i',
    this.url,
    '-f',
    'mpegts',
    '-codec:v',
    'mpeg1video',
    // additional ffmpeg options go here
    ...this.additionalFlags,
    '-',
  ];
  this.stream = child_process.spawn(options.ffmpegPath, this.spawnOptions, {
    detached: false,
  });
  this.inputStreamStarted = true;

  this.stream.stdout.on('data', (data) => {
 
    count1 =count1 +1;
  
    // console.log('count1',count1)
    return this.emit('mpeg1data', data);
  });
  setInterval(()=>{ 
    console.log("Pre:",{count1},{count2},{count3})
    if((count2==count1) && (count2 !=0 && count2 !=0 )){
      count3=count3+1
    }
    if ((count3==count4)){count3=0} 
    count2 =count1;
    if (count3==5){
      console.log("connection lost")
      console.log("This is pid " + process.pid);
      setTimeout(function () {
          process.on("exit", function () {
              require("child_process").spawn(process.argv.shift(), process.argv, {
                  cwd: process.cwd(),
                  detached : true,
                  stdio: "inherit"
              });
          });
          process.exit();
      }, 5000);
    }
    count4=count3
    console.log("Post:",{count1},{count2},{count3})
  },2000)
  this.stream.stderr.on('data', (data) => {
    // console.log('data2222222222222222222222222',data)
    return this.emit('ffmpegStderr', data);

  });

  this.stream.on('exit', (code, signal) => {
    console.log('data1111111111111111asdsadsaddddddddddddddddddddddddddddddddd111',code)
    if (code === 1) {
      console.error('RTSP stream exited with error');
      this.exitCode = 1;
      return this.emit('exitWithError');
    }
  });
  return this;
};

util.inherits(Mpeg1Muxer, events.EventEmitter);

module.exports = 
{
  Mpeg1Muxer: Mpeg1Muxer,
  count3: count3,
};
