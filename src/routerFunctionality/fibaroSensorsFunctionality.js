'use strict';

const superagent = require('superagent');

// Application setup
const IP_ADDRESS_FOR_FIBARO_SENSORS_MERAKI = process.env.IP_ADDRESS_FOR_FIBARO_SENSORS_MERAKI || '192.168.128.4';  // property  192.168.2.107  192.168.129.11;
const FIBARO_USER_NAME = process.env.FIBARO_USER_NAME;
const FIBARO_PASSWORD = process.env.FIBARO_PASSWORD;

// Global Vars

// Functions definitions
/** 
 * This function will get the temperature from Fibaro sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
var getTemperatureFibaro = async function (req, res, next) {
  var tempDeviceID = req.query.deviceID;
  superagent.get(`http://${IP_ADDRESS_FOR_FIBARO_SENSORS_MERAKI}/api/devices/${tempDeviceID}`)
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
};
  
/** 
   * This function will get the temperature from Fibaro sensor
   * @param {obj} req 
   * @param {obj} res 
   * @param {function} next 
   */
var getHistoricalTemperatureFibaro = async function (req, res, next) {
  var tempDeviceID = req.query.deviceID;
  var dateDiff = req.query.dateDiff;
  superagent.get(`http://${IP_ADDRESS_FOR_FIBARO_SENSORS_MERAKI}/api/temperature/now-${dateDiff}/now/summary-graph/devices/temperature/${tempDeviceID}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .auth(FIBARO_USER_NAME, FIBARO_PASSWORD)
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
   * This function will get the Humidity from Fibaro sensor
   * @param {obj} req 
   * @param {obj} res 
   * @param {function} next 
   */
var getHumidityFibaro = async function (req, res, next) {
  var humidityDeviceID = req.query.deviceID;
  superagent.get(`http://${IP_ADDRESS_FOR_FIBARO_SENSORS_MERAKI}/api/devices/${humidityDeviceID}`)
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
};

/** 
 * This function will get the historical power consumption from Fibaro sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
var getHistoricalPowerConsumption = async function (req, res, next) {
  var powerDeviceID = req.query.deviceID;
  var dateDiff = req.query.dateDiff;
  superagent.get(`http://${IP_ADDRESS_FOR_FIBARO_SENSORS_MERAKI}/api/energy/now-${dateDiff}/now/summary-graph/devices/energy/${powerDeviceID}`)
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
};

var fibaroSensorsFunctionality = {};
fibaroSensorsFunctionality.getTemperatureFibaro=getTemperatureFibaro;
fibaroSensorsFunctionality.getHistoricalTemperatureFibaro=getHistoricalTemperatureFibaro;
fibaroSensorsFunctionality.getHistoricalPowerConsumption=getHistoricalPowerConsumption;
fibaroSensorsFunctionality.getHumidityFibaro=getHumidityFibaro;
module.exports = fibaroSensorsFunctionality;