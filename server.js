'use strict';

// Load environment variables from .env
require('dotenv').config();
// Application dependencies
const express = require('express');
// For kill any process
var cp = require('child_process')
// const cors = require('cors');
// const pg = require('pg');
// Application setup
var modulecount = require('./mpeg1muxer');
const PORT = process.env.PORT;
const server =  express();
// server.use(cors());
server.set('view engine','ejs');
server.use(express.static('./public'));

var cameraIp = '192.168.128.212';
var cameraPort = 9000;

var Stream = require('./videoStream');
var stream = new Stream({
  name: 'name',
  streamUrl: `rtsp://${cameraIp}:${cameraPort}/live`,//`rtsp://${cameraIp}:${cameraPort}/live`,//'rtsp://192.168.128.2:9000/live'
  wsPort: 9999,
  ffmpegOptions: { // options ffmpeg flags

    '-reconnect':'1',
    '-reconnect_at_eof' : '1',
    '-reconnect_streamed' : '1',
    '-reconnect_delay_max' : 4000,
    // '-timeout' : 1000000,
    '-stats': '', // an option with no neccessary value uses a blank string
    '-r': 25,// options with required values specify the value after the key
    // '-vf':'mpdecivfrmate',
    // '-vsync':'vfr',
    
    // 'timelimit':30000,
    '-bufsize': '420p' ,
    //'-loglevel':'8',
    '-rtsp_transport' : 'tcp',
    '-max_delay': 0,
    // '-listen_timeout':4000,

    //  '-debug_ts':'',
    //  '-xerror':'',

  },
});

var refreshTime = 7; // will be multiplied by 2 sec 
setInterval(async () => {
  console.log("##########",modulecount.count3())

  if (modulecount.count3()==refreshTime){
    console.log("connection lost")
    console.log("This is pid " + process.pid);
        process.on("exit", async function () {
            require("child_process").spawn(process.argv.shift(), process.argv, {
                cwd: process.cwd(),
                detached : true,
                stdio: "inherit"
            });

        });

            await cp.exec("pkill ffmpeg", function(err, stdout, stderr) {console.log("kill error:",err)})

            process.exit(1);

  }
}, 2000);
 process.on('SIGINT', async function() {


  await cp.exec("pkill ffmpeg", function(err, stdout, stderr) {console.log("kill error:",err)})

  process.exit(1);
});





console.log('try to connect');

  server.listen(PORT || 4000,"0.0.0.0", () => console.log(`App is listening on ${PORT || 4000}`))


server.use('*',(req,res)=>{
  res.status(404).send('Go kill your self :*(');
});

