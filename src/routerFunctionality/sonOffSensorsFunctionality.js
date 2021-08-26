
'use strict';

const ewelink = require('ewelink-api'); // For Ac switch
var helpers  = require('../helpers/helpers.js');
const ThresholdsEnum = require('../enum/thresholdsEnum.js');
const SensorTypeEnum = require('../enum/sensorTypeEnum');
const SensorActionEnum = require('../enum/sensorActionEnum');


// Application setup
const SONOFF_PASSWORD = process.env.SONOFF_PASSWORD;
const SONOFF_EMAIL = process.env.SONOFF_EMAIL;

// Global Vars

// Functions definitions
/** 
 * This function will check Ac switch status from SONOFF sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
var checkAcSwitchStatus = async function (req, res, next) {
  var CheckSwitchStatusID = req.query.deviceID;
  var acSwitchObject={};
  const connection = new ewelink({
    email: SONOFF_EMAIL,
    password: SONOFF_PASSWORD,
    region: 'as',
  });
  try {
    const device = await connection.getDevice(CheckSwitchStatusID);
    if(device.params){
      if (device.params.switch == 'on'){
        acSwitchObject.status = ThresholdsEnum.acControl.on;
      }else if (device.params.switch == 'off'){
        acSwitchObject.status = ThresholdsEnum.acControl.off;
      }
      acSwitchObject.value = device.params.switch;
    }
    res.status(200).send(acSwitchObject);
  }
  catch(err) {
    console.log('Check Ac switch status error: ', err);
    res.status(403).send('Check Ac switch status error');
  }
};

/** 
 * This function will change switch status from SONOFF sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
var SwitchAcSwitchSonOff = async function (req, res, next) {
  var  switchAcSwitchID = req.query.deviceID;
  var userId = req.query.userId;
  var roomId = req.query.roomId;
  var buildingId = req.query.buildingId;
  var acSwitchObject={};
  const connection = new ewelink({
    email: SONOFF_EMAIL,
    password: SONOFF_PASSWORD,
    region: 'as',
  });
  try {
    const switchStatus = await connection.toggleDevice(switchAcSwitchID); 
    console.log('switchStatus1:',switchStatus);

    if (switchStatus.status == 'ok'){
      const device = await connection.getDevice(switchAcSwitchID);
      console.log('switchStatus2:',switchStatus);
      console.log('switchStatus.status:',switchStatus.status);
      console.log('device.params.switch:',device.params.switch);
      if(device.params){
        if (device.params.switch == 'on'){
          acSwitchObject.status = ThresholdsEnum.acControl.on;
          helpers.switchLogGenerator(SensorTypeEnum.sensorType.acSwitch,SensorActionEnum.actionID.on,userId,roomId,buildingId);
          helpers.historicalDataGenerator(SensorTypeEnum.sensorType.acSwitch,Number(SensorActionEnum.actionID.on),SensorActionEnum.actionID.on,new Date().toUTCString());
        }else if (device.params.switch == 'off'){
          acSwitchObject.status = ThresholdsEnum.acControl.off;
          helpers.switchLogGenerator(SensorTypeEnum.sensorType.acSwitch,SensorActionEnum.actionID.off,userId,roomId,buildingId);
          helpers.historicalDataGenerator(SensorTypeEnum.sensorType.acSwitch,Number(SensorActionEnum.actionID.off),SensorActionEnum.actionID.off,new Date().toUTCString());
        }
        acSwitchObject.value = switchStatus.status;
      }
    }

    res.status(200).send(acSwitchObject || []);
  }
  catch(err) {
    console.log('Switch Ac switch status error: ', err);
    res.status(403).send('Switch Ac switch status error');
  }
};

var sonOffSensorsFunctionality = {};
sonOffSensorsFunctionality.checkAcSwitchStatus=checkAcSwitchStatus;
sonOffSensorsFunctionality.SwitchAcSwitchSonOff=SwitchAcSwitchSonOff;
module.exports = sonOffSensorsFunctionality;