
'use strict';

const superagent = require('superagent');
var helpers  = require('../helpers/helpers.js');
const SensorTypeEnum = require('../enum/sensorTypeEnum');
const SensorActionEnum = require('../enum/sensorActionEnum');

// Application setup
const IP_ADDRESS_FOR_AKUVOX_DOOR_PHONE = process.env.IP_ADDRESS_FOR_AKUVOX_DOOR_PHONE;

// Global Vars

// Functions definitions
/** 
 * This function will open door switch status from Akuvox sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
var openDoorSwitch =async function(req, res, next) {
  var doorID = req.query.doorID;
  var actionName = req.query.actionName;
  var userId = req.query.userId;
  var roomId = req.query.roomId;
  var buildingId = req.query.buildingId;

  superagent.get(`http://${IP_ADDRESS_FOR_AKUVOX_DOOR_PHONE}/fcgi/do?action=${actionName}&DoorNum=${doorID}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .then(openDoorSwitch => {

      // console.log('openDoorSwitch', openDoorSwitch.body);
      if (openDoorSwitch.body) { 
        helpers.switchLogGenerator(SensorTypeEnum.sensorType.door,SensorActionEnum.actionID.on,userId,roomId,buildingId);
        helpers.historicalDataGenerator(SensorTypeEnum.sensorType.door,Number(SensorActionEnum.actionID.on),SensorActionEnum.actionID.on,new Date().toUTCString());
        res.status(200).send(openDoorSwitch.body); } else { res.status(200).send([]); }
    })
    .catch(err => {
      console.log('Door switch sensor error: ', err);
      res.status(403).send('Power switch sensor error');
    });
};

var akuvoxSensorsFunctionality = {};
akuvoxSensorsFunctionality.openDoorSwitch=openDoorSwitch;
module.exports = akuvoxSensorsFunctionality;