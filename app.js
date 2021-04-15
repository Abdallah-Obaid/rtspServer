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


const Stream = require('node-rtsp-stream-es6');
 
const options = {
  name: 'streamName',
  url: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',
  port: 4000,
};
 
var stream = new Stream(options);
 
stream.start();