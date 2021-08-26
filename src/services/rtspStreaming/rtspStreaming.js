'use strict';

var cp = require('child_process');
var modulecount = require('../../lib/mpeg1muxer');
var Stream = require('../../lib/videoStream');

// Application setup
const CAMERA_IP = process.env.CAMERA_IP;
const CAMERA_PORT = process.env.CAMERA_PORT;
const RECORDING_DIRECTORY = process.env.RECORDING_DIRECTORY;
const SOCKET_PORT_CAMERA_STRAM = process.env.SOCKET_PORT_CAMERA_STRAM;
const RECORD_DURATION_SECONDS = process.env.RECORD_DURATION_SECONDS;
const REFRESH_RTSP_INTERAVAL_SECONDS = process.env.REFRESH_RTSP_INTERAVAL_SECONDS;

// Global Vars
var ffmpegPID='';
var streamRestartInterval;

// Functions definitions
/** 
 * This function will run rtsp stream
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
var loadRtspStream = async function (req, res, next) {
  var recordDuration = RECORD_DURATION_SECONDS || 120; //in sec
  if (ffmpegPID){
    await cp.exec(`kill -9 ${ffmpegPID}`, function (err, stdout, stderr) { 
      console.log('kill ffmpeg done PID:', ffmpegPID);
      console.log('Turn of old stream service');
    });
    await modulecount.resetCount3();
    clearInterval(streamRestartInterval);
    ffmpegPID =null;
  }
  var stream = await new Stream({
    name: 'name',
    streamUrl: `rtsp://${CAMERA_IP}:${CAMERA_PORT}/live`,//`rtsp://${CAMERA_IP}:${CAMERA_PORT}/live`,//'rtsp://192.168.128.2:9000/live'
    wsPort: SOCKET_PORT_CAMERA_STRAM,
    ffmpegOptions: { // options ffmpeg flags
      '-c': 'copy',
      '-f': 'segment',
      '-strftime': '1',
      '-segment_time': `${recordDuration}`,
      // '-segment_format' : 'mp4',
      '-codec:v': 'libx264',
      [RECORDING_DIRECTORY]: '',
    }, 
  });
  rtspStreamRestartingInterval();
  await cp.exec('pidof ffmpeg', function (err, stdout, stderr) { ffmpegPID = stdout.split(' ')[0]; console.log('ffmpegPID',stdout.split(' ')[0]);});
  process.on('SIGINT', async function () {
    await cp.exec(`kill -9 ${ffmpegPID}`, function (err, stdout, stderr) { console.log('kill ffmpeg done PID:', ffmpegPID); });
    process.exit(1);
  });
  if(res){
    res.send('Start stream');
  }
};

/** 
 * This function will start rtsp Stream Restarting Interval
 */
var rtspStreamRestartingInterval = function (){
  var refreshRtspTime = REFRESH_RTSP_INTERAVAL_SECONDS || 10; // will be multiplied by 2 sec 
  streamRestartInterval = setInterval(() => {
    console.log('##########', modulecount.count3());
    if (modulecount.count3() == refreshRtspTime) {
      restartStream();
    }
  }, 2000);
};

/** 
 * This function will restart RTSP stream
 */
var restartStream = async function (){
  await cp.exec(`kill -9 ${ffmpegPID}`, function (err, stdout, stderr) { console.log('kill ffmpeg done PID:', ffmpegPID); });
  await modulecount.resetCount3();
  clearInterval(streamRestartInterval);
  await loadRtspStream();
};

/** 
 * This function will stop rtsp stream
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
var stopStreamService =async function(req, res, next){
  console.log('ffmpegPID', ffmpegPID);
  if (ffmpegPID){
    await cp.exec(`kill -9 ${ffmpegPID}`, function (err, stdout, stderr) { 
      console.log('kill ffmpeg done PID:', ffmpegPID);
      console.log('Turn of stream service');
    });
    await modulecount.resetCount3();
    clearInterval(streamRestartInterval);
    ffmpegPID =null;
    res.send('Stream service turned off');
  }else{
    res.send('Stream service already off');
  }
};

var rtspStreaming = {};
rtspStreaming.loadRtspStream=loadRtspStream;
rtspStreaming.rtspStreamRestartingInterval=rtspStreamRestartingInterval;
rtspStreaming.stopStreamService=stopStreamService;
module.exports = rtspStreaming;