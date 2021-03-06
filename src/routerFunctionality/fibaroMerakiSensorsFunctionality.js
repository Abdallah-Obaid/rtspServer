
'use strict';

const superagent = require('superagent');
var helpers  = require('../helpers/helpers.js');
const ThresholdsEnum = require('../enum/thresholdsEnum.js');
const SensorTypeEnum = require('../enum/sensorTypeEnum');
const SensorActionEnum = require('../enum/sensorActionEnum');

// Application setup
const IP_ADDRESS_FOR_FIBARO_SENSORS_MERAKI =  process.env.IP_ADDRESS_FOR_FIBARO_SENSORS_MERAKI;
const FIBARO_USER_NAME_MERAKI = process.env.FIBARO_USER_NAME_MERAKI;
const FIBARO_PASSWORD_MERAKI = process.env.FIBARO_PASSWORD_MERAKI;

// Global Vars

// Functions definitions
/** 
 * This function will get the smoke test from Fibaro sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
var getSmoke = async function (req, res, next) {
  var smokeDeviceID = req.query.deviceID;
  superagent.get(`http://${IP_ADDRESS_FOR_FIBARO_SENSORS_MERAKI}/api/devices/${smokeDeviceID}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .auth(FIBARO_USER_NAME_MERAKI, FIBARO_PASSWORD_MERAKI)
    .then(smokeData => {
      var smokeObject = {};
      var smokeDatavalue = smokeData.body.properties.value;
      if (smokeDatavalue) {
        if (smokeDatavalue == 'true') {
          smokeObject.status=ThresholdsEnum.smokeAlarm.fire;
        }else{
          smokeObject.status=ThresholdsEnum.smokeAlarm.normal;
        }
        smokeObject.value=smokeDatavalue;
        // console.log('smokeData', smokeData.body.properties.value);
        res.status(200).send(smokeObject); } else { res.status(200).send([]); }
    })
    .catch(err => {
      console.log('Smoke sensor error: ', err);
      res.status(403).send('Smoke sensor error');
    });
};

/** 
 * This function will get the dust from Fibaro sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
var getDust = async function (req, res, next) {
  var dustDeviceID = req.query.deviceID;
  superagent.get(`http://${IP_ADDRESS_FOR_FIBARO_SENSORS_MERAKI}/api/devices/${dustDeviceID}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .auth(FIBARO_USER_NAME_MERAKI, FIBARO_PASSWORD_MERAKI)
    .then(async dustData => {
      var dustObject = {};
      var dustDatavalue = dustData.body.properties.value;
      if (dustDatavalue || dustDatavalue == 0) {
        var thresholds =await helpers.getThresholds();
        if (thresholds.dust.high >= Number(dustDatavalue) && Number(dustDatavalue) >= thresholds.dust.low) {
          dustObject.status=ThresholdsEnum.dust.normal;
        }
        if (thresholds.dust.high < Number(dustDatavalue)) {
          dustObject.status=ThresholdsEnum.dust.high;
        }
        if (Number(dustDatavalue) < thresholds.dust.low) {
          dustObject.status=ThresholdsEnum.dust.low;
        }
        dustObject.value=dustDatavalue;
        // console.log('dustData', dustData.body.properties.value);
        res.status(200).send(dustObject); } else { res.status(200).send([]); }

    })
    .catch(err => {
      console.log('Dust sensor error: ', err);
      res.status(403).send('Dust sensor error');
    });
};

/** 
 * This function will get the Co2 from Fibaro sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
var getCo2 = async function (req, res, next) {
  var co2DeviceID = req.query.deviceID;
  superagent.get(`http://${IP_ADDRESS_FOR_FIBARO_SENSORS_MERAKI}/api/devices/${co2DeviceID}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .auth(FIBARO_USER_NAME_MERAKI, FIBARO_PASSWORD_MERAKI)
    .then(async co2Data => {
      var co2Object = {};
      var co2Datavalue = co2Data.body.properties.value;
      if (co2Datavalue || co2Datavalue == 0) {
        var thresholds =await helpers.getThresholds();
        if (thresholds.co2.high >= Number(co2Datavalue) && Number(co2Datavalue) >= thresholds.co2.low) {
          co2Object.status=ThresholdsEnum.co2.normal;
        }
        if (thresholds.co2.high < Number(co2Datavalue)) {
          co2Object.status=ThresholdsEnum.co2.high;
        }
        if (Number(co2Datavalue) < thresholds.co2.low) {
          co2Object.status=ThresholdsEnum.co2.low;
        }
        co2Object.value=co2Datavalue;
        // console.log('co2Data', co2Data.body.properties.value);
        res.status(200).send(co2Object); } else { res.status(200).send([]); }

    })
    .catch(err => {
      console.log('Co2 sensor error: ', err);
      res.status(403).send('Co2 sensor error');
    });
};

/** 
 * This function will get the power consumption from Fibaro Meraki sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
var getPowerConsumption =async function (req, res, next) {
  var powerDeviceID = req.query.deviceID;
  var powerDeviceIDAmpere = req.query.deviceIDAmpere;
  var powerDeviceIDVolt = req.query.deviceIDVolt;
  var powerObject = {};
  powerObject.value={};

  superagent.get(`http://${IP_ADDRESS_FOR_FIBARO_SENSORS_MERAKI}/api/devices?parentId=${powerDeviceID}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .auth(FIBARO_USER_NAME_MERAKI, FIBARO_PASSWORD_MERAKI)
    .then(powerData => {
      const filterPowerData = powerData.body.filter((itemInArray) => {return (itemInArray.id == powerDeviceIDAmpere ||itemInArray.id == powerDeviceIDVolt)  ;});
      powerObject.value.ampere = Number(filterPowerData[1].properties.value);
      powerObject.value.volt = Math.abs(filterPowerData[0].properties.value);
      powerObject.value.watt = Math.abs(filterPowerData[0].properties.value * filterPowerData[1].properties.value);
      if (powerObject) { res.status(200).send(powerObject); } else { res.status(200).send([]); }
    })
    .catch(err => {
      console.log('Power sensor error: ', err);
      res.status(403).send('Power sensor error');
    });
};


/** 
 * This function will check switch status from Fibaro Meraki sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
var checkSwitchStatus = async function (req, res, next) {
  var CheckSwitchStatusID = req.query.deviceID;
  superagent.get(`http://${IP_ADDRESS_FOR_FIBARO_SENSORS_MERAKI}/api/devices/${CheckSwitchStatusID}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .auth(FIBARO_USER_NAME_MERAKI, FIBARO_PASSWORD_MERAKI)
    .then(checkSwitchStatus => {

      // console.log('checkSwitchStatus', checkSwitchStatus.body.properties.value);
      if (checkSwitchStatus.body.properties.value) { res.status(200).send(checkSwitchStatus.body.properties.value); } else { res.status(200).send([]); }

    })
    .catch(err => {
      console.log('Check switch status error: ', err);
      res.status(403).send('Check switch status error');
    });
};

/** 
 * This function will change switch status from Fibaro Meraki sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
var postPowerSwitch = async function (req, res, next) {
  var PostPowerSwitchID = req.query.deviceID;
  var actionName = req.query.actionName;
  var userId = req.query.userId;
  var roomId = req.query.roomId;
  var buildingId = req.query.buildingId;
  superagent.post(`http://${IP_ADDRESS_FOR_FIBARO_SENSORS_MERAKI}/api/devices/${PostPowerSwitchID}/action/${actionName}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .auth(FIBARO_USER_NAME_MERAKI, FIBARO_PASSWORD_MERAKI)
    .then(PostPowerSwitch => {

      console.log('PostPowerSwitch', PostPowerSwitch.body.result);
      if (PostPowerSwitch.body.result) {
        if(actionName=='turnOn') {
          helpers.switchLogGenerator(SensorTypeEnum.sensorType.lightSwitch,SensorActionEnum.actionID.on,userId,roomId,buildingId);
          helpers.historicalDataGenerator(SensorTypeEnum.sensorType.lightSwitch,Number(SensorActionEnum.actionID.on),SensorActionEnum.actionID.on,new Date().toUTCString());

        }
        if(actionName=='turnOff'){
          helpers.switchLogGenerator(SensorTypeEnum.sensorType.lightSwitch,SensorActionEnum.actionID.off,userId,roomId,buildingId);
          helpers.historicalDataGenerator(SensorTypeEnum.sensorType.lightSwitch,Number(SensorActionEnum.actionID.off),SensorActionEnum.actionID.off,new Date().toUTCString());
        }
        // console.log(PostPowerSwitch.body);
        res.status(200).send(actionName); 
      } else { res.status(200).send([]); }

    })
    .catch(err => {
      console.log('Power switch sensor error: ', err);
      res.status(403).send('Power switch sensor error');
    });
};

var fibaroMerakiSensorsFunctionality = {};
fibaroMerakiSensorsFunctionality.getPowerConsumption=getPowerConsumption;
fibaroMerakiSensorsFunctionality.getSmoke=getSmoke;
fibaroMerakiSensorsFunctionality.getDust=getDust;
fibaroMerakiSensorsFunctionality.getCo2=getCo2;
fibaroMerakiSensorsFunctionality.checkSwitchStatus=checkSwitchStatus;
fibaroMerakiSensorsFunctionality.postPowerSwitch=postPowerSwitch;
module.exports = fibaroMerakiSensorsFunctionality;