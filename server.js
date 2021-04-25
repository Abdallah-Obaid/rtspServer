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
// var flag =false;
//  console.log("stream:",stream.width)
// setInterval(()=>{console.log("stream:",stream.width)
// if(stream.width){

// }

// },1000)
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
            // var cmd = `sudo killall ffmpeg`;
            // var getprocessIdCommand = `ps aux | grep ffmpeg`;
            // var processId =  cp.exec(getprocessIdCommand, function(err, stdout, stderr) {console.log("getprocessIdCommand:",getprocessIdCommand)})
            // var killProcessCommand = `kill -9 ${processId}`;
            // process.kill(getprocessIdCommand, 'SIGINT');
            await cp.exec("pkill ffmpeg", function(err, stdout, stderr) {console.log("kill error:",err)})
            //  cp.exec(killProcessCommand, function(err, stdout, stderr) {console.log("kill error:",err)})
            //  cp.exec("kill -9 $(ps aux | grep '\sffmpeg\s' | awk '{print $2}')", function(err, stdout, stderr) {console.log("kill error:",err)})
            //  cp.exec("kill $(ps -e | grep node | awk '{print $1}')", function(err, stdout, stderr) {console.log("kill error:",err)})
            //  cp.exec("kill $(ps -e | grep dmn | awk '{print $2}')", function(err, stdout, stderr) {console.log("kill error:",err)})
            //  cp.exec(cmd, function(err, stdout, stderr) {console.log("kill error:",err)})
            // console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
            process.exit(1);

  }
}, 2000);
 process.on('SIGINT', async function() {

 

  // var cmd = `sudo killall ffmpeg`;
  // var getprocessIdCommand = `ps aux | grep ffmpeg`;
  // var processId = await cp.exec(getprocessIdCommand, function(err, stdout, stderr) {console.log("getprocessIdCommand:",getprocessIdCommand)})
  // var killProcessCommand = `kill -9 ${processId}`;
  // await cp.exec(killProcessCommand, function(err, stdout, stderr) {console.log("kill error:",err)})
  // await cp.exec("kill -9 $(ps aux | grep '\sffmpeg\s' | awk '{print $2}')", function(err, stdout, stderr) {console.log("kill error:",err)})
  // await cp.exec("kill $(ps -e | grep node | awk '{print $1}')", function(err, stdout, stderr) {console.log("kill error:",err)})
  // await cp.exec("kill $(ps -e | grep dmn | awk '{print $2}')", function(err, stdout, stderr) {console.log("kill error:",err)})
  // await cp.exec(cmd, function(err, stdout, stderr) {console.log("kill error:",err)})
  // console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
  await cp.exec("pkill ffmpeg", function(err, stdout, stderr) {console.log("kill error:",err)})

  process.exit(1);
});

// const Recorder = require('node-rtsp-recorder').Recorder;
//  var rec = new Recorder({
//   url: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',
//   timeLimit: 10, // time in seconds for each segmented video file
//   folder: 'd:/streamvideos/',
//   directoryPathFormat: 'MMM-Do-YY',
//   fileNameFormat: 'YYYY-M-D-h-mm-ss',
//   name: 'cam1',
// });
// // Starts Recording
// rec.startRecording();
// setTimeout(() => {
//   console.log('Stopping Recording');
//   rec.stopRecording();
//   rec = null;
// }, 300000);



// var recaudeo = new Recorder({
//   url: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',
//   timeLimit: 600, // time in seconds for each segmented video file
//   folder: 'd:/streamvideos/',
//   name: 'cam1',
//   type: 'audio',
// });

// recaudeo.startRecording();

// setTimeout(() => {
//   console.log('Stopping Recording');
//   rec.stopRecording();
//   rec = null;
// }, 125000);



// var recpec = new Recorder({
//   url: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',
//   folder: 'd:/streamvideos/',
//   name: 'cam1',
//   type: 'image',
// });
// recpec.captureImage(() => {
//   console.log('Image Captured');
// });
// setInterval(() => {
//   recpec.captureImage(() => {
//     console.log('Image Captured');
//   });
// }, 5000);
// server.get('/',(request,response) => {
//   var Stream = require('node-rtsp-stream');
// var stream = new Stream({
//   name: 'name',
//   streamUrl: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',//'rtsp://192.168.128.2:9000/live'
//   wsPort: 9999,
//   ffmpegOptions: { // options ffmpeg flags
//     '-stats': '', // an option with no neccessary value uses a blank string
//     '-r': 30 ,// options with required values specify the value after the key
//     // '-bufsize': '1M' ,
//   },
// });
//     response.send('IT WORK');
// });
// server.get('/', (req,res)=>{
//   client.query('select * from tblads')
//     .then((results)=> {console.table(results.rows);var names=[];var attend=[];console.log('any thing'); results.rows.forEach((ele)=>{names.push(ele.first_name);attend.push(ele.attendance);});   res.render('./index',{names:names,attend:attend });
//     });});
// server.post('/data', (req,res)=>{
//   client.query('select * from penguin.testo')
//     .then((results)=> {res.send(results.rows); })
//     .catch((error) => console.log(error));
// });

// server.get('/home', (req,res)=>{
//   client.query('select * from penguin."tblads_views"')
//     .then((results)=> {res.send(results.row);})
//     .catch((e) => console.log(e));
// });
    




console.log('try to connect');

  server.listen(PORT || 4000,"0.0.0.0", () => console.log(`App is listening on ${PORT || 4000}`))


server.use('*',(req,res)=>{
  res.status(404).send('Go kill your self :*(');
});

