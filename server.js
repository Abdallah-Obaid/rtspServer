'use strict';

// Load environment variables from .env
var mqtt  = require('mqtt');
require('dotenv').config();
const client = require('./DBconection.js');
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
  streamUrl: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',
  wsPort: 9999,
  // ffmpegOptions: { // options ffmpeg flags
  //   '-stats': '', // an option with no neccessary value uses a blank string
  //   '-r': 30 ,// options with required values specify the value after the key
  //   // '-bufsize': '1M' ,
  // },
});

const Recorder = require('node-rtsp-recorder').Recorder;
 
var rec = new Recorder({
  url: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',
  timeLimit: 10, // time in seconds for each segmented video file
  folder: 'd:/streamvideos/',
  directoryPathFormat: 'MMM-Do-YY',
  fileNameFormat: 'YYYY-M-D-h-mm-ss',
  name: 'cam1',
});
// Starts Recording
rec.startRecording();

setTimeout(() => {
  console.log('Stopping Recording');
  rec.stopRecording();
  rec = null;
}, 300000);



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
server.post('/data', (req,res)=>{
  client.query('select * from penguin.testo')
    .then((results)=> {res.send(results.rows); })
    .catch((error) => console.log(error));
});

// server.get('/home', (req,res)=>{
//   client.query('select * from penguin."tblads_views"')
//     .then((results)=> {res.send(results.row);})
//     .catch((e) => console.log(e));
// });
    


var topic =  ['ciscoconnect','pentrack'];
var client1  = mqtt.connect('mqtt://iot.beaconyun.com',{clientId:'mqttjs01'});
client1.on('connect',function(){	
  console.log('connected');
  client1.subscribe(topic,{qos:1});
  client1.on('message',function(topic, message, packet){
    var jsonArr=JSON.parse(message);
    jsonArr.forEach((ele)=>{
      if(ele['mac']==='AC233FA25735'){
        if(ele.temperature||ele.humidity){

          
          client.query(`INSERT INTO penguin.testo (humidity, temperature, timestamp)VALUES (${ele.humidity}, ${ele.temperature},'${new Date().toISOString()}');`);
          // client.query("INSERT INTO penguin.tblads_views (pennav_userid, ad_id, entry_date)VALUES (null, null,'2004-10-19 10:23:54');");
          console.log('dsadas',new Date().toISOString());
          console.log('///////////////////////////////');   
          console.log('topic: ',topic);      
          console.log('timestamp: ',ele.timestamp);
          console.log('temperature: ',ele.temperature);
          console.log('humidity: ',ele.humidity);
          console.log('///////////////////////////////');  
        }

      }
    });
    
    // console.log('message is '+typeof(message)  + JSON.parse(message)[0]['mac']);
    // console.log('topic is '+ topic);
  });
  client.on('error',function(error){ console.log('Can\'t connect'+error);});
  // setTimeout(()=>{client1.end();console.log('MQTT stop');},[5000]);
  
});
console.log('try to connect');
client.connect()
  .then(()=>server.listen(PORT, () => console.log(`App is listening on ${PORT}`)))
  .then(()=> console.log('Connected Successfully'))
  .catch(error=>console.error('hi'));
console.log('anything@@@@@@@@@@');

server.use('*',(req,res)=>{
  res.status(404).send('Go kill your self :*(');
});

