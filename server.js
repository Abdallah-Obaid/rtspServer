'use strict';

// Load environment variables from .env
var mqtt  = require('mqtt');
require('dotenv').config();
// Application dependencies
const express = require('express');
// const cors = require('cors');
// const pg = require('pg');
// Application setup
const PORT = process.env.PORT;
const server =  express();
// server.use(cors());
server.set('view engine','ejs');
server.use(express.static('./public'));

var Stream = require('node-rtsp-stream');
var stream = new Stream({
  name: 'name',
  streamUrl: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',//'rtsp://192.168.128.2:9000/live'
  wsPort: 9999,
  ffmpegOptions: { // options ffmpeg flags
    '-stats': '', // an option with no neccessary value uses a blank string
    '-r': 30 ,// options with required values specify the value after the key
    // '-bufsize': '1M' ,
  },
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

  server.listen(PORT || 4000, () => console.log(`App is listening on ${PORT || 4000}`))


server.use('*',(req,res)=>{
  res.status(404).send('Go kill your self :*(');
});

