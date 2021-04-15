//
//  recordExample.js
//  node-rtsp-recorder
//
//  Created by Sahil Chaddha on 24/08/2018.
//

// const Recorder = require('node-rtsp-recorder').Recorder;

// var rec = new Recorder({
//   url: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',
//   folder: 'd:/streamvideos/',
//   timeLimit: 60,
//   name: 'cam1',
//   directoryPathFormat: 'MMM-Do-YY',
//   fileNameFormat: 'YYYY-M-D-h-mm-ss',
// });
// rec.startRecording();

// setTimeout(() => {
//   console.log('Stopping Recording');
//   rec.stopRecording();
//   rec = null;
// }, 300000);



//
//  recordExample.js
//  node-rtsp-recorder
//
//  Created by Sahil Chaddha on 24/08/2018.
//

const Recorder = require('./recorder');

var rec = new Recorder({
  url: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',
  timeLimit: 600,    
  folder: 'd:/streamvideos/',
  name: 'cam1',
  directoryPathFormat: 'MMM-Do-YY',
  fileNameFormat: 'YYYY-M-D-h-mm-ss',
});
rec.startRecording();

setTimeout(() => {
  console.log('Stopping Recording');
  rec.stopRecording();
  rec = null;
}, 300000);