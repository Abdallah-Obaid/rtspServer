'use strict';

const superagent = require('superagent');
const express = require('express');
const router = express.Router();
var cp = require('child_process');
var modulecount = require('./lib/mpeg1muxer');
var Stream = require('./lib/videoStream');
// Main routs
router.get('/loadRtspStream', loadRtspStream);

// Fibaro routs
router.get('/getTemperature/', getTemperature);
router.get('/getSmoke/', getSmoke);
router.get('/getPowerConsumption/', getPowerConsumption);
router.get('/checkSwitchStatus/', checkSwitchStatus);
router.post('/postPowerSwitch/', postPowerSwitch);


// Meraki routs
router.get('/getHumidity', getHumidity);
router.get('/getWaterLeakTest', getWaterLeakTest);
router.get('/getDoorStatus', getDoorStatus);



// Application setup
const IP_ADDRESS_FOR_FIBARO_SENSORS = process.env.IP_ADDRESS_FOR_FIBARO_SENSORS || '192.168.2.107';  // property  192.168.2.107  192.168.129.11;
const FIBARO_PASSWORD = process.env.FIBARO_PASSWORD;
const FIBARO_USER_NAME = process.env.FIBARO_USER_NAME;
const CAMERAIP = process.env.CAMERAIP;
const CAMERAPORT = process.env.CAMERAPORT;
const MERAKI_API_KEY = process.env.MERAKI_API_KEY;

// Functions definitions
/** 
 * This function will run rtsp stream
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
async function loadRtspStream(req, res, next)
{
  await cp.exec('pkill ffmpeg', function(err, stdout, stderr) {console.log('kill error:',err);});
  
  var stream = new Stream({
    name: 'name',
    streamUrl: `rtsp://192.168.128.212:${CAMERAPORT}/live`,//`rtsp://${cameraIp}:${cameraPort}/live`,//'rtsp://192.168.128.2:9000/live'
    wsPort: 9999,
    ffmpegOptions: { // options ffmpeg flags
  
      '-reconnect':'1',
      '-reconnect_at_eof' : '1',
      '-reconnect_streamed' : '1',
      '-reconnect_delay_max' : 4000,
      '-stats': '', // an option with no neccessary value uses a blank string
      '-r': 25,// options with required values specify the value after the key
      '-bufsize': '420p' ,
      '-rtsp_transport' : 'tcp',
      '-max_delay': 0,
  
    },
  });
  var refreshTime = 10; // will be multiplied by 2 sec 
  setInterval(async () => {
    console.log('##########',modulecount.count3());
    if (modulecount.count3()==refreshTime){
      // console.log('connection lost');
      // console.log('This is pid ' + process.pid);
      process.on('exit', async function () {
        require('child_process').spawn(process.argv.shift(), process.argv, {
          cwd: process.cwd(),
          detached : true,
          stdio: 'inherit',
        });
  
      });
      await cp.exec('pkill ffmpeg', function(err, stdout, stderr) {console.log('kill error:',err);});
      process.exit(1);
    }
  }, 2000);

  process.on('SIGINT', async function() {
    await cp.exec('pkill ffmpeg', function(err, stdout, stderr) {console.log('kill error:',err);});
    process.exit(1);
  });

  res.send('IT WORK');

}


/** 
 * This function will get the temperature from Fibaro sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
async function getTemperature(req, res, next)
{
  var tempDeviceID = req.query.deviceID; 
  superagent.get(`http://${IP_ADDRESS_FOR_FIBARO_SENSORS}/api/devices/${tempDeviceID}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .auth(FIBARO_USER_NAME, FIBARO_PASSWORD)
    .then(TempData => {

      // console.log('TempData', TempData.body.properties.value);
      if (TempData.body.properties.value) { res.status(200).send( TempData.body.properties.value); } else { return []; }

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
async function getSmoke(req, res, next)
{
  var smokeDeviceID = req.query.deviceID; 
  superagent.get(`http://${IP_ADDRESS_FOR_FIBARO_SENSORS}/api/devices/${ smokeDeviceID}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .auth(FIBARO_USER_NAME, FIBARO_PASSWORD)
    .then(smokeData => {
  
      // console.log('smokeData', smokeData.body.properties.value);
      if (smokeData.body.properties.value) { res.status(200).send( smokeData.body.properties.value); } else { return []; }
  
    })
    .catch(err => {
      console.log('Smoke sensor error: ', err);
      res.status(403).send('Smoke sensor error');
    });
}

/** 
 * This function will get the historical power consumption from Fibaro sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
async function getPowerConsumption(req, res, next)
{
  var powerDeviceID = req.query.deviceID; 
  superagent.get(`http://${IP_ADDRESS_FOR_FIBARO_SENSORS}/api/energy/now-100000/now/summary-graph/devices/energy/${ powerDeviceID}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .auth(FIBARO_USER_NAME, FIBARO_PASSWORD)
    .then(powerData => {
  
      // console.log('powerData', powerData.body);
      if (powerData.body) { res.status(200).send(powerData.body);} else { return []; }
  
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
async function checkSwitchStatus(req, res, next)
{
  var CheckSwitchStatusID = req.query.deviceID;
  superagent.get(`http://${IP_ADDRESS_FOR_FIBARO_SENSORS}/api/devices/${ CheckSwitchStatusID }`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .auth(FIBARO_USER_NAME, FIBARO_PASSWORD)
    .then(checkSwitchStatus => {
  
      // console.log('checkSwitchStatus', checkSwitchStatus.body.properties.value);
      if (checkSwitchStatus.body.properties.value) { res.status(200).send(checkSwitchStatus.body.properties.value);} else { return []; }
  
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
async function postPowerSwitch(req, res, next)
{
  var PostPowerSwitchID = req.query.deviceID;
  var actionName =req.query.actionName;
  superagent.post(`http://${IP_ADDRESS_FOR_FIBARO_SENSORS}/api/devices/${ PostPowerSwitchID }/action/${actionName}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .auth(FIBARO_USER_NAME, FIBARO_PASSWORD)
    .then(PostPowerSwitch => {
  
      // console.log('PostPowerSwitch', PostPowerSwitch.body.result);
      if (PostPowerSwitch.body.result) { res.status(200).send(PostPowerSwitch.body.result); } else { return []; }
  
    })
    .catch(err => {
      console.log('Power switch sensor error: ', err);
      res.status(403).send('Power switch sensor error');
    });
}

/** 
 * This function will return humidity from Meraki sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
async function getHumidity(req, res, next)
{
  var deviceSerial = req.query.deviceSerial;
  var merakiNetworkID =req.query.merakiNetworkID;
  superagent.get(`https://api.meraki.com/api/v1/networks/${merakiNetworkID}/environmental/events?sensorSerial=${deviceSerial}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('X-Cisco-Meraki-API-Key', MERAKI_API_KEY)
    .then(humidityData => {
      // console.log('Humidity', humidityData.body);
      if (humidityData.body[0].eventData) { res.status(200).send( humidityData.body[0].eventData.cutoff); } else { return []; }
 
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
async function getWaterLeakTest(req, res, next)
{
  var deviceSerial = req.query.deviceSerial;
  var merakiNetworkID =req.query.merakiNetworkID;
  superagent.get(`https://api.meraki.com/api/v1/networks/${merakiNetworkID}/environmental/events?sensorSerial=${deviceSerial}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('X-Cisco-Meraki-API-Key', MERAKI_API_KEY)
    .then(waterLeakData => {
      // console.log('waterLeakData', waterLeakData.body);
      if (waterLeakData.body[0].eventData) { res.status(200).send( waterLeakData.body[0].eventData.value); } else { return []; }
  
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
async function getDoorStatus(req, res, next)
{
  var deviceSerial = req.query.deviceSerial;
  var merakiNetworkID =req.query.merakiNetworkID;
  superagent.get(`https://api.meraki.com/api/v1/networks/${merakiNetworkID}/environmental/events?sensorSerial=${deviceSerial}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('X-Cisco-Meraki-API-Key', MERAKI_API_KEY)
    .then(doorStatusData => {
      // console.log('doorStatusData', doorStatusData.body);
      if (doorStatusData.body) { res.status(200).send( doorStatusData.body); } else { return []; }
   
    })
    .catch(err => {
      console.log('Door Status sensor error: ', err);
      res.status(403).send('Door Status sensor error');
    });
}

module.exports = router;