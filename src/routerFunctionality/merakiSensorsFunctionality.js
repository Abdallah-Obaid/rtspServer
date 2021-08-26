
'use strict';

const superagent = require('superagent');
var helpers  = require('../helpers/helpers.js');
const ThresholdsEnum = require('../enum/thresholdsEnum.js');


// Application setup
const MERAKI_API_KEY = process.env.MERAKI_API_KEY;

// Global Vars

// Functions definitions
/** 
 * This function will return Temperature from Meraki sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
var getTemperatureMeraki = async function (req, res, next) {
  var deviceSerial = req.query.deviceSerial;
  var merakiNetworkID = req.query.merakiNetworkID;
  var metric = req.query.metric;
  superagent.get(`https://api.meraki.com/api/v1/networks/${merakiNetworkID}/sensors/stats/latestBySensor?metric=${metric}&serial=${deviceSerial}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('X-Cisco-Meraki-API-Key', MERAKI_API_KEY)
    .then(async temperatureData => {
      var temperatureObject = {};
      var temperatureDatavalue = temperatureData.body[0].value;
      if (temperatureDatavalue || temperatureDatavalue == 0) {
        var thresholds =await helpers.getThresholds();
        if (thresholds.temperature.high >= Number(temperatureDatavalue) && Number(temperatureDatavalue) >= thresholds.temperature.low) {
          temperatureObject.status=ThresholdsEnum.temperature.normal;
        }
        if (thresholds.temperature.high < Number(temperatureDatavalue)) {
          temperatureObject.status=ThresholdsEnum.temperature.high;
        }
        if (Number(temperatureDatavalue) < thresholds.temperature.low) {
          temperatureObject.status=ThresholdsEnum.temperature.low;
        }
        temperatureObject.value=temperatureDatavalue;
        // console.log('temperatureData', temperatureData.body.properties.value);
        res.status(200).send(temperatureObject); } else { res.status(200).send([]); }
    })
    .catch(err => {
      console.log('Temperature sensor error: ', err);
      res.status(403).send('Temperature sensor error');
    });
};

/** 
 * This function will get the historical temperature from Meraki sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
var getHistoricalTemperatureMeraki = async function (req, res, next) {
  var deviceSerial = req.query.deviceSerial;
  var merakiNetworkID = req.query.merakiNetworkID;
  var metric = req.query.metric;
  var t0 = req.query.t0;
  var t1 = req.query.t1;
  var resolution  = req.query.resolution;
  superagent.get(`https://api.meraki.com/api/v1/networks/${merakiNetworkID}/sensors/stats/historicalBySensor?metric=${metric}&serial=${deviceSerial}&t0=${t0}&t1=${t1}&resolution=${resolution}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('X-Cisco-Meraki-API-Key', MERAKI_API_KEY)
    .then(historicalTempData => {

      // console.log('TempData', TempData.body.properties.value);
      if (historicalTempData.body) { res.status(200).send(historicalTempData.body); } else { res.status(200).send([]); }

    })
    .catch(err => {
      console.log('Historical temp sensor error: ', err);
      res.status(403).send('Historical temp sensor error');
    });
};


/** 
 * This function will return humidity from Meraki sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
var getHumidityMeraki = async function (req, res, next) {
  var deviceSerial = req.query.deviceSerial;
  var merakiNetworkID = req.query.merakiNetworkID;
  var metric = req.query.metric;
  superagent.get(`https://api.meraki.com/api/v1/networks/${merakiNetworkID}/sensors/stats/latestBySensor?metric=${metric}&serial=${deviceSerial}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('X-Cisco-Meraki-API-Key', MERAKI_API_KEY)
    .then(async humidityData => {
      var humidityObject = {};
      var humidityDatavalue = humidityData.body[0].value;
      if (humidityDatavalue || humidityDatavalue == 0) {
        var thresholds =await helpers.getThresholds();
        if (thresholds.humidity.high >= Number(humidityDatavalue) && Number(humidityDatavalue) >= thresholds.humidity.low) {
          humidityObject.status=ThresholdsEnum.humidity.normal;
        }
        if (thresholds.humidity.high < Number(humidityDatavalue)) {
          humidityObject.status=ThresholdsEnum.humidity.high;
        }
        if (Number(humidityDatavalue) < thresholds.humidity.low) {
          humidityObject.status=ThresholdsEnum.humidity.low;
        }
        humidityObject.value=humidityDatavalue;
        console.log('humidityObjecthumidityObjecthumidityObjecthumidityObjecthumidityObject', humidityObject);
        res.status(200).send(humidityObject); } else { res.status(200).send([]); }
    })
    .catch(err => {
      console.log('Humidity sensor error: ', err);
      res.status(403).send('Humidity sensor error');
    });
};

/** 
 * This function will get the historical Humidity from Meraki sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
var getHistoricalHumidityMeraki =async function (req, res, next) {
  var deviceSerial = req.query.deviceSerial;
  var merakiNetworkID = req.query.merakiNetworkID;
  var metric = req.query.metric;
  var t0 = req.query.t0;
  var t1 = req.query.t1;
  var resolution  = req.query.resolution;
  superagent.get(`https://api.meraki.com/api/v1/networks/${merakiNetworkID}/sensors/stats/historicalBySensor?metric=${metric}&serial=${deviceSerial}&t0=${t0}&t1=${t1}&resolution=${resolution}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('X-Cisco-Meraki-API-Key', MERAKI_API_KEY)
    .then(historicalHumidityData => {
      if (historicalHumidityData.body) { res.status(200).send(historicalHumidityData.body); } else { res.status(200).send([]); }
    })
    .catch(err => {
      console.log('Historical humidity sensor error: ', err);
      res.status(403).send('Historical humidity sensor error');
    });
};

/** 
 * This function will return water leak test result from Meraki sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
var getWaterLeakTest = async function (req, res, next) {
  var deviceSerial = req.query.deviceSerial;
  var merakiNetworkID = req.query.merakiNetworkID;
  var metric = req.query.metric;
  superagent.get(`https://api.meraki.com/api/v1/networks/${merakiNetworkID}/sensors/stats/latestBySensor?metric=${metric}&serial=${deviceSerial}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('X-Cisco-Meraki-API-Key', MERAKI_API_KEY)
    .then(waterLeakData => {

      var waterLeakObject = {};
      var waterLeakDatavalue = waterLeakData.body[0].value;
      if (waterLeakDatavalue || waterLeakDatavalue == 0 ) {
        // console.log("waterLeakDatavalue",waterLeakDatavalue)
        if (Number(waterLeakDatavalue) == 0) {
          waterLeakObject.status=ThresholdsEnum.waterLeak.normal;
        }else{
          waterLeakObject.status=ThresholdsEnum.waterLeak.veryHigh;
        }
        waterLeakObject.value=waterLeakDatavalue;
        // console.log('waterLeakData', waterLeakData.body.properties.value);
        res.status(200).send(waterLeakObject); } else { res.status(200).send([]); }
    })
    .catch(err => {
      console.log('WaterLeak sensor error: ', err);
      res.status(403).send('WaterLeak sensor error');
    });
};

/** 
 * This function will get the historical waterLeak from Meraki sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
var getHistoricalWaterLeakMeraki =async function (req, res, next) {
  var deviceSerial = req.query.deviceSerial;
  var merakiNetworkID = req.query.merakiNetworkID;
  var metric = req.query.metric;
  var t0 = req.query.t0;
  var t1 = req.query.t1;
  var resolution  = req.query.resolution;
  superagent.get(`https://api.meraki.com/api/v1/networks/${merakiNetworkID}/sensors/stats/historicalBySensor?metric=${metric}&serial=${deviceSerial}&t0=${t0}&t1=${t1}&resolution=${resolution}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('X-Cisco-Meraki-API-Key', MERAKI_API_KEY)
    .then(historicalWaterLeakData => {
      // console.log('TempData', TempData.body.properties.value);
      if (historicalWaterLeakData.body) { res.status(200).send(historicalWaterLeakData.body); } else { res.status(200).send([]); }

    })
    .catch(err => {
      console.log('Historical waterLeak sensor error: ', err);
      res.status(403).send('Historical waterLeak sensor error');
    });
};


/** 
 * This function will return the historical door status from Meraki sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
var getDoorStatus =async function (req, res, next) {
  var deviceSerial = req.query.deviceSerial;
  var eventName = req.query.eventName;
  var merakiNetworkID = req.query.merakiNetworkID;
  superagent.get(`https://api.meraki.com/api/v1/networks/${merakiNetworkID}/environmental/events?includedEventTypes[]=${eventName}&sensorSerial=${deviceSerial}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('X-Cisco-Meraki-API-Key', MERAKI_API_KEY)
    .then(doorStatusData => {
      var doorStatusObject = {};
      var doorStatusDatavalue = doorStatusData.body[0].eventData.value;
      // console.log('############',doorStatusData.body)
      if (doorStatusDatavalue || doorStatusDatavalue == 0) {
        if (Number(doorStatusDatavalue) == 0) {
          doorStatusObject.status=ThresholdsEnum.doorStatus.open;
        }else{
          doorStatusObject.status=ThresholdsEnum.doorStatus.locked;
        }
        doorStatusObject.value=doorStatusData.body;
        // console.log('doorStatusData', doorStatusData.body.properties.value);
        res.status(200).send(doorStatusObject); } else { res.status(200).send([]); }
    })
    .catch(err => {
      console.log('Door Status sensor error: ', err);
      res.status(403).send('Door Status sensor error');
    });
};

var merakiSensorsFunctionality = {};
merakiSensorsFunctionality.getTemperatureMeraki=getTemperatureMeraki;
merakiSensorsFunctionality.getHistoricalTemperatureMeraki=getHistoricalTemperatureMeraki;
merakiSensorsFunctionality.getHistoricalHumidityMeraki=getHistoricalHumidityMeraki;
merakiSensorsFunctionality.getHistoricalWaterLeakMeraki=getHistoricalWaterLeakMeraki;
merakiSensorsFunctionality.getHumidityMeraki=getHumidityMeraki;
merakiSensorsFunctionality.getWaterLeakTest=getWaterLeakTest;
merakiSensorsFunctionality.getDoorStatus=getDoorStatus;

module.exports = merakiSensorsFunctionality;