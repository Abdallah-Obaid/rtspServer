
'use strict';

var MqttTester  = require('../services/mqtt/mqtt.js');

// Application setup

// Global Vars
var soundAlarm = false;

// Functions definitions
/** 
 * This function will get sound alarm from Meraki
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
var getSoundAlarm = async function (req, res, next) {
  try {
    console.log(MqttTester.soundAlarm);
    if (MqttTester.soundAlarm == 'noFire') {
      res.status(200).send(MqttTester.soundAlarm);
    } else if (MqttTester.soundAlarm == 'fireAlarm') {
      res.status(200).send(MqttTester.soundAlarm);
    }
  } catch (error){
    res.status(404).send(error);
  }
};

/** 
 * This function will initialize mqtt service
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
var runMqtt = function (req, res, next){
  // var topic  =  '/merakimv/Q2PV-NCFZ-QY79/raw_detections'; //  /merakimv/Q2PV-NCFZ-QY79/audio_detections  /merakimv/Q2PV-NCFZ-QY79/raw_detections
  // var hostIP = 'mqtt://test.mosquitto.org'; // mqtt://test.mosquitto.org
  // var clientId = 'PenguinIn';  // PenguinIn
  // MqttTester.mqttFunc(topic,hostIP,clientId);
  try{
    var topic  =  'obaid'; //  /merakimv/Q2PV-NCFZ-QY79/audio_detections  /merakimv/Q2PV-NCFZ-QY79/raw_detections
    var hostIP = 'mqtt://20.36.27.184'; // mqtt://test.mosquitto.org
    var port = '1883';
    var clientId = 'PenguinIn';  // PenguinIn
    MqttTester.mqttFunc(topic,hostIP,port,clientId);
    if(res){res.send('Mqtt Service Started');}
    
  }  catch(err) {
    console.log('Mqtt Service error: ', err);
    if(res){res.status(403).send('Mqtt Service error');}
  }
};

/** 
 * This function will stop mqtt service
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
var stopMqttService = function (req, res, next){
  try{
    res.send(MqttTester.stopMqtt());
  }  catch(err) {
    console.log('Mqtt Service Stop error: ', err);
    res.status(403).send('Mqtt Service Stop error');
  }
};

var merakiSoundAlarmFunctionality = {};
merakiSoundAlarmFunctionality.getSoundAlarm=getSoundAlarm;
merakiSoundAlarmFunctionality.runMqtt=runMqtt;
merakiSoundAlarmFunctionality.stopMqttService=stopMqttService;
module.exports = merakiSoundAlarmFunctionality;