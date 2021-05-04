'use strict';

const superagent = require('superagent');
const express = require('express');
const router = express.Router();
var cp = require('child_process');
const fs = require('fs');
const path = require('path');// to remove .mp4 from file name
var modulecount = require('./lib/mpeg1muxer');
var Stream = require('./lib/videoStream');
const { json } = require('express');
// Main routs
// router.get('/loadRtspStream', loadRtspStream);
router.get('/recordedVideo', loadVideo);
router.get('/recordList', recordList);
router.get('/sensorsNumber', sensorsNumber);

// Fibaro routs
router.get('/getTemperatureFibaro/', getTemperatureFibaro);
router.get('/getHumidityFibaro/', getHumidityFibaro);
router.get('/getSmoke/', getSmoke);
router.get('/getDust/', getDust);
router.get('/getCo2/', getCo2);
router.get('/getPowerConsumption/', getPowerConsumption);
router.get('/checkSwitchStatus/', checkSwitchStatus);
router.post('/postPowerSwitch/', postPowerSwitch);


// Meraki routs
router.get('/getTemperatureMeraki/', getTemperatureMeraki);
router.get('/getHumidityMeraki', getHumidityMeraki);
router.get('/getWaterLeakTest', getWaterLeakTest);
router.get('/getDoorStatus', getDoorStatus);



// Application setup
const IP_ADDRESS_FOR_FIBARO_SENSORS = process.env.IP_ADDRESS_FOR_FIBARO_SENSORS || '192.168.2.107';  // property  192.168.2.107  192.168.129.11;
const FIBARO_PASSWORD = process.env.FIBARO_PASSWORD;
const FIBARO_USER_NAME = process.env.FIBARO_USER_NAME;
const CAMERAIP = process.env.CAMERAIP;
const CAMERAPORT = process.env.CAMERAPORT;
const MERAKI_API_KEY = process.env.MERAKI_API_KEY;
const SENSORS_NUMBER = process.env.SENSORS_NUMBER;

// Functions definitions
/** 
 * This function will run rtsp stream
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
async function loadRtspStream(req, res, next) {
  // await cp.exec('pkill ffmpeg', function(err, stdout, stderr) {console.log('kill error:',err);});
  var recordDuration = 120; //in sec
  var stream = await new Stream({
    name: 'name',
    streamUrl: `rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov`,//`rtsp://${CAMERAIP}:${CAMERAPORT}/live`,//'rtsp://192.168.128.2:9000/live'
    wsPort: 9999,
    ffmpegOptions: { // options ffmpeg flags

      // '-reconnect':'1',
      // '-reconnect_at_eof' : '1',
      // '-reconnect_streamed' : '1',
      // '-reconnect_delay_max' : 4000,
      // '-stats': '', // an option with no neccessary value uses a blank string
      // '-r': 25,// options with required values specify the value after the key
      // '-bufsize': '420p' ,
      // '-rtsp_transport' : 'tcp',
      // '-max_delay': 0,
      // '-r' : '25',
      '-c': 'copy',
      '-f': 'segment',
      '-strftime': '1',
      '-segment_time': `${recordDuration}`,
      // '-segment_format' : 'mp4',
      '-codec:v': 'libx264',
      './recorded_videos/%d-%m-%Y_%H-%M-%S.mp4': '',





    },
  });
  var refreshTime = 10; // will be multiplied by 2 sec 
  setInterval(async () => {
    console.log('##########', modulecount.count3());
    if (modulecount.count3() == refreshTime) {

      // console.log('connection lost');
      // console.log('This is pid ' + process.pid);
      process.on('exit', async function () {
        require('child_process').spawn(process.argv.shift(), process.argv, {
          cwd: process.cwd(),
          detached: true,
          stdio: 'inherit',
        });

      });
      await cp.exec('pkill ffmpeg', function (err, stdout, stderr) { console.log('kill error:', err); });
      process.exit(1);
      // loadRtspStream(req, res, next)
    }
  }, 2000);

  process.on('SIGINT', async function () {
    await cp.exec('pkill ffmpeg', function (err, stdout, stderr) { console.log('kill error:', err); });
    process.exit(1);
  });

  res.send('IT WORK');

}
loadRtspStream();

/** 
 * This function will get the temperature from Fibaro sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
async function getTemperatureFibaro(req, res, next) {
  var tempDeviceID = req.query.deviceID;
  superagent.get(`http://${IP_ADDRESS_FOR_FIBARO_SENSORS}/api/devices/${tempDeviceID}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .auth(FIBARO_USER_NAME, FIBARO_PASSWORD)
    .then(tempData => {

      // console.log('TempData', TempData.body.properties.value);
      if (tempData.body.properties.value) { res.status(200).send(tempData.body.properties.value); } else { res.status(200).send([]); }

    })
    .catch(err => {
      console.log('Temp sensor error: ', err);
      res.status(403).send('Temp sensor error');
    });
}

/** 
 * This function will get the Humidity from Fibaro sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
async function getHumidityFibaro(req, res, next) {
  var humidityDeviceID = req.query.deviceID;
  superagent.get(`http://${IP_ADDRESS_FOR_FIBARO_SENSORS}/api/devices/${humidityDeviceID}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .auth(FIBARO_USER_NAME, FIBARO_PASSWORD)
    .then(humidityData => {

      // console.log('TempData', TempData.body.properties.value);
      if (humidityData.body.properties.value) { res.status(200).send(humidityData.body.properties.value); } else { res.status(200).send([]); }

    })
    .catch(err => {
      console.log('Temp sensor error: ', err);
      res.status(403).send('Temp sensor error');
    });
}

/** 
 * This function will get the smoke test from Fibaro sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
async function getSmoke(req, res, next) {
  var smokeDeviceID = req.query.deviceID;
  superagent.get(`http://${IP_ADDRESS_FOR_FIBARO_SENSORS}/api/devices/${smokeDeviceID}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .auth(FIBARO_USER_NAME, FIBARO_PASSWORD)
    .then(smokeData => {

      // console.log('smokeData', smokeData.body.properties.value);
      if (smokeData.body.properties.value) { res.status(200).send(smokeData.body.properties.value); } else { res.status(200).send([]); }

    })
    .catch(err => {
      console.log('Smoke sensor error: ', err);
      res.status(403).send('Smoke sensor error');
    });
}

/** 
 * This function will get the dust from Fibaro sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
async function getDust(req, res, next) {
  var dustDeviceID = req.query.deviceID;
  superagent.get(`http://${IP_ADDRESS_FOR_FIBARO_SENSORS}/api/devices/${dustDeviceID}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .auth(FIBARO_USER_NAME, FIBARO_PASSWORD)
    .then(dustData => {

      // console.log('dustData', dustData.body.properties.value);
      if (dustData.body.properties.value) { res.status(200).send(dustData.body.properties.value); } else { res.status(200).send([]); }

    })
    .catch(err => {
      console.log('Dust sensor error: ', err);
      res.status(403).send('Dust sensor error');
    });
}

/** 
 * This function will get the Co2 from Fibaro sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
async function getCo2(req, res, next) {
  var co2DeviceID = req.query.deviceID;
  superagent.get(`http://${IP_ADDRESS_FOR_FIBARO_SENSORS}/api/devices/${co2DeviceID}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .auth(FIBARO_USER_NAME, FIBARO_PASSWORD)
    .then(co2Data => {

      // console.log('dustData', dustData.body.properties.value);
      if (co2Data.body.properties.value) { res.status(200).send(co2Data.body.properties.value); } else { res.status(200).send([]); }

    })
    .catch(err => {
      console.log('Co2 sensor error: ', err);
      res.status(403).send('Co2 sensor error');
    });
}

/** 
 * This function will get the historical power consumption from Fibaro sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
async function getPowerConsumption(req, res, next) {
  var powerDeviceID = req.query.deviceID;
  var dateDiff = req.query.dateDiff;
  superagent.get(`http://${IP_ADDRESS_FOR_FIBARO_SENSORS}/api/energy/now-100000/now/summary-graph/devices/energy/${powerDeviceID}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .auth(FIBARO_USER_NAME, FIBARO_PASSWORD)
    .then(powerData => {

      // console.log('powerData', powerData.body);
      if (powerData.body) { res.status(200).send(powerData.body); } else { res.status(200).send([]); }

    })
    .catch(err => {
      console.log('Power sensor error: ', err);
      res.status(403).send('Power sensor error');
    });
}

/** 
 * This function will check switch status from Fibaro sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
async function checkSwitchStatus(req, res, next) {
  var CheckSwitchStatusID = req.query.deviceID;
  superagent.get(`http://${IP_ADDRESS_FOR_FIBARO_SENSORS}/api/devices/${CheckSwitchStatusID}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .auth(FIBARO_USER_NAME, FIBARO_PASSWORD)
    .then(checkSwitchStatus => {

      // console.log('checkSwitchStatus', checkSwitchStatus.body.properties.value);
      if (checkSwitchStatus.body.properties.value) { res.status(200).send(checkSwitchStatus.body.properties.value); } else { res.status(200).send([]); }

    })
    .catch(err => {
      console.log('Check switch status error: ', err);
      res.status(403).send('Check switch status error');
    });
}

/** 
 * This function will change switch status from Fibaro sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
async function postPowerSwitch(req, res, next) {
  var PostPowerSwitchID = req.query.deviceID;
  var actionName = req.query.actionName;
  superagent.post(`http://${IP_ADDRESS_FOR_FIBARO_SENSORS}/api/devices/${PostPowerSwitchID}/action/${actionName}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .auth(FIBARO_USER_NAME, FIBARO_PASSWORD)
    .then(PostPowerSwitch => {

      // console.log('PostPowerSwitch', PostPowerSwitch.body.result);
      if (PostPowerSwitch.body.result) { res.status(200).send(PostPowerSwitch.body.result); } else { res.status(200).send([]); }

    })
    .catch(err => {
      console.log('Power switch sensor error: ', err);
      res.status(403).send('Power switch sensor error');
    });
}


/** 
 * This function will return Temperature from Meraki sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
async function getTemperatureMeraki(req, res, next) {
  var deviceSerial = req.query.deviceSerial;
  var merakiNetworkID = req.query.merakiNetworkID;
  var eventType = req.query.eventType;
  superagent.get(`https://api.meraki.com/api/v1/networks/${merakiNetworkID}/environmental/events?sensorSerial=${deviceSerial}&perPage=5&includedEventTypes[]=${eventType}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('X-Cisco-Meraki-API-Key', MERAKI_API_KEY)
    .then(temperatureData => {
      // console.log('temperatureData', temperatureData.body);

      if (temperatureData.body[0].eventData) {
        var dateModeArr = [];
        var tempValue = [];
        temperatureData.body.forEach((ele) => {
          var dateMod = `${new Date(ele.occurredAt).getUTCDate()}/${new Date(ele.occurredAt).getUTCMonth() + 1}`
          dateModeArr.push(dateMod);
          tempValue.push(Number(ele.eventData.value).toFixed(2))
        })
        var arrayToSend = {
          date: dateModeArr,
          tempValue: tempValue,
        }
        var dataToSent = {
          allData: arrayToSend,
          temperatureData: temperatureData.body[0].eventData.value,
        };
        res.status(200).send(JSON.stringify(dataToSent));
      } else { res.status(200).send([]); }

    })
    .catch(err => {
      console.log('Temperature sensor error: ', err);
      res.status(403).send('Temperature sensor error');
    });
}

/** 
 * This function will return humidity from Meraki sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
async function getHumidityMeraki(req, res, next) {
  var deviceSerial = req.query.deviceSerial;
  var merakiNetworkID = req.query.merakiNetworkID;
  var eventType = req.query.eventType;
  superagent.get(`https://api.meraki.com/api/v1/networks/${merakiNetworkID}/environmental/events?sensorSerial=${deviceSerial}&perPage=10&includedEventTypes[]=${eventType}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('X-Cisco-Meraki-API-Key', MERAKI_API_KEY)
    .then(humidityData => {
      // console.log('humidityData', humidityData.body);
      if (humidityData.body[0].eventData) { res.status(200).send(humidityData.body[0].eventData.value); } else { res.status(200).send([]); }

    })
    .catch(err => {
      console.log('Humidity sensor error: ', err);
      res.status(403).send('Humidity sensor error');
    });
}

/** 
 * This function will return water leak test result from Meraki sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
async function getWaterLeakTest(req, res, next) {
  debugger
  var deviceSerial = req.query.deviceSerial;
  var merakiNetworkID = req.query.merakiNetworkID;
  var eventType = req.query.eventType;
  superagent.get(`https://api.meraki.com/api/v1/networks/${merakiNetworkID}/environmental/events?sensorSerial=${deviceSerial}&perPage=10&includedEventTypes[]=${eventType}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('X-Cisco-Meraki-API-Key', MERAKI_API_KEY)
    .then(waterLeakData => {
      // console.log('waterLeakData', waterLeakData.body);
      if (waterLeakData.body[0].eventData) { res.status(200).send(waterLeakData.body[0].eventData.value); } else { res.status(200).send([]); }

    })
    .catch(err => {
      console.log('WaterLeak sensor error: ', err);
      res.status(403).send('WaterLeak sensor error');
    });
}

/** 
 * This function will return the historical door status from Meraki sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
async function getDoorStatus(req, res, next) {
  var deviceSerial = req.query.deviceSerial;
  var merakiNetworkID = req.query.merakiNetworkID;
  superagent.get(`https://api.meraki.com/api/v1/networks/${merakiNetworkID}/environmental/events?sensorSerial=${deviceSerial}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('X-Cisco-Meraki-API-Key', MERAKI_API_KEY)
    .then(doorStatusData => {
      // console.log('doorStatusData', doorStatusData.body);
      if (doorStatusData.body) { res.status(200).send(doorStatusData.body); } else { res.status(200).send([]); }

    })
    .catch(err => {
      console.log('Door Status sensor error: ', err);
      res.status(403).send('Door Status sensor error');
    });
}


/** 
 * This function will open the door from Akuvox sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
async function openDoor(req, res, next) {
  var action = req.query.deviceSerial || 'OpenDoor';
  var DoorNum = req.query.merakiNetworkID || 1;
  superagent.get(`hhttp://192.168.2.220/fcgi/do?action=${action}&DoorNum=${DoorNum}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .then(doorStatusData => {
      // console.log('doorStatusData', doorStatusData.body);
      if (doorStatusData.body) { res.status(200).send(doorStatusData.body); } else { res.status(200).send([]); }

    })
    .catch(err => {
      console.log('Door Status sensor error: ', err);
      res.status(403).send('Door Status sensor error');
    });
}

/** 
* This function will load the recorded video by name
* @param {obj} req 
* @param {obj} res 
* @param {function} next 
*/
function loadVideo(req, res, next) {
  var videoNameQ = req.query.videoName;
  const path = `recorded_videos/${videoNameQ}.mp4`
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize - 1
    const chunksize = (end - start) + 1
    const file = fs.createReadStream(path, { start, end })
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
}

/** 
* This function will send all the recorded video file name to front end
* @param {obj} req 
* @param {obj} res 
* @param {function} next 
*/
function recordList(req, res, next) {
  try {
    var filterDate = req.query.filterDate;
    console.log("filterDate:",filterDate)
    const testFolder = './recorded_videos/';
    var fullFileName = []
    fs.readdir(testFolder, (err, files) => {
      files.forEach(file => {
        var fileNameWithoutExt = path.parse(file).name;
        var dateWithoutTime = fileNameWithoutExt.split('_')[0].split('-').join('/');
        if(filterDate==dateWithoutTime){
        fullFileName.push(fileNameWithoutExt);
        }
      });
      if (fullFileName) { res.status(200).send(fullFileName); } else { res.status(200).send([]); }
    });

  } catch (error) {
    console.log('Record list error: ', error);
    res.status(403).send('Record list error');
  }
}


/** 
 * This function will return the sensors number
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
function sensorsNumber(req, res, next) {
  if (SENSORS_NUMBER) { res.status(200).send(SENSORS_NUMBER); } else { res.status(200).send(0); }

}
module.exports = router;