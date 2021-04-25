// var Stream = require('node-rtsp-stream-jsmpeg');
// var options ={
//   name: 'name',
//   streamUrl: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',
//   wsPort: 9999,
//   width: 352,
//   height: 288,
//   fps: '24',
//   kbs: '2048k',
//   ffmpegOptions: { 
//     '-stats': '', 
//     '-r': 20, 
//     '-q:v': 32, 
//     '-b': '2000K', 
//   },
// };
// var stream = new Stream(options);
// console.log('stream: ',stream);
// stream.start();
// console.log('stream: ',stream);


var cameraIp = '192.168.128.212';
var cameraPort = 9000;

var Stream = require('node-rtsp-stream');
var stream = new Stream({
  name: 'name',
  streamUrl: `rtsp://${cameraIp}:${cameraPort}/live`,//'rtsp://192.168.128.2:9000/live'
  wsPort: 9990,
  ffmpegOptions: { // options ffmpeg flags
    // '-reconnect':1,
    // '-reconnect_at_eof':1,
    // '-reconnect_streamed':1,
    '-reconnect_delay_max':3,
    '-stats': '', // an option with no neccessary value uses a blank string
    '-r': 25,// options with required values specify the value after the key

    // '-vf':'mpdecivfrmate',
    // '-vsync':'vfr',
    
    // 'timelimit':30000,
     //'-bufsize': '420p' ,
  },
});