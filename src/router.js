'use strict';

const express = require('express');
const router = express.Router();
var DynamicAlerts  = require('./services/dynamicAlerts/dynamicAlerts.js');
var HistoricalData  = require('./services/historicalData/historicalData');
var rtspStreaming = require('./services/rtspStreaming/rtspStreaming.js');
var fibaroSensorsFunctionality = require('./routerFunctionality/fibaroSensorsFunctionality.js');
var fibaroMerakiSensorsFunctionality = require('./routerFunctionality/fibaroMerakiSensorsFunctionality.js');
var sonOffSensorsFunctionality = require('./routerFunctionality/sonOffSensorsFunctionality.js');
var akuvoxSensorsFunctionality = require('./routerFunctionality/akuvoxSensorsFunctionality.js');
var merakiSensorsFunctionality = require('./routerFunctionality/merakiSensorsFunctionality.js');
var merakiSoundAlarmFunctionality = require('./routerFunctionality/merakiSoundAlarmFunctionality.js');
var loadRecordFunctionality = require('./routerFunctionality/loadRecordFunctionality.js');
var generalFunctionality = require('./routerFunctionality/generalFunctionality.js');

// Main routs
router.get('/recordedVideo', loadRecordFunctionality.loadVideo);
router.get('/recordList', loadRecordFunctionality.recordList);
router.get('/sensorsNumber', generalFunctionality.sensorsNumber);

// Fibaro routs Meraki # NOT USED NOW 
router.get('/getTemperatureFibaro/', fibaroSensorsFunctionality.getTemperatureFibaro);
router.get('/getHistoricalTemperatureFibaro/', fibaroSensorsFunctionality.getHistoricalTemperatureFibaro);
router.get('/getHistoricalPowerConsumption/', fibaroSensorsFunctionality.getHistoricalPowerConsumption);
router.get('/getHumidityFibaro/', fibaroSensorsFunctionality.getHumidityFibaro);

// Fibaro routs Meraki
router.get('/getPowerConsumption/', fibaroMerakiSensorsFunctionality.getPowerConsumption);
router.get('/getSmoke/', fibaroMerakiSensorsFunctionality.getSmoke);
router.get('/getDust/', fibaroMerakiSensorsFunctionality.getDust);
router.get('/getCo2/', fibaroMerakiSensorsFunctionality.getCo2);
router.get('/checkSwitchStatus/', fibaroMerakiSensorsFunctionality.checkSwitchStatus);
router.get('/postPowerSwitch/', fibaroMerakiSensorsFunctionality.postPowerSwitch);

// Akuvox routs Meraki
router.get('/openDoorSwitch/', akuvoxSensorsFunctionality.openDoorSwitch);

// Meraki routs
router.get('/getTemperatureMeraki/', merakiSensorsFunctionality.getTemperatureMeraki);
router.get('/getHistoricalTemperatureMeraki/', merakiSensorsFunctionality.getHistoricalTemperatureMeraki);
router.get('/getHistoricalHumidityMeraki/', merakiSensorsFunctionality.getHistoricalHumidityMeraki);
router.get('/getHistoricalWaterLeakMeraki/', merakiSensorsFunctionality.getHistoricalWaterLeakMeraki);
router.get('/getHumidityMeraki', merakiSensorsFunctionality.getHumidityMeraki);
router.get('/getWaterLeakTest', merakiSensorsFunctionality.getWaterLeakTest);
router.get('/getDoorStatus', merakiSensorsFunctionality.getDoorStatus);
router.get('/getSoundAlarm',merakiSoundAlarmFunctionality.getSoundAlarm);

// SonOff routs
router.get('/checkAcSwitchStatus/', sonOffSensorsFunctionality.checkAcSwitchStatus);
router.get('/SwitchAcSwitchSonOff/', sonOffSensorsFunctionality.SwitchAcSwitchSonOff);

// Services loaders routs
router.get('/loadRtspStream', rtspStreaming.loadRtspStream);
router.get('/runMqtt/', merakiSoundAlarmFunctionality.runMqtt);
router.get('/loadAlertService/', DynamicAlerts.loadAlertService);
router.get('/loadHistoricalDataService/', HistoricalData.loadHistoricalDataService);

// Services turning off routs
router.get('/stopStreamService/', rtspStreaming.stopStreamService);
router.get('/stopMqttService/', merakiSoundAlarmFunctionality.stopMqttService);
router.get('/stopAlertService/', DynamicAlerts.stopAlertService);
router.get('/stopHistoricalDataService/', HistoricalData.stopHistoricalDataService);

// Application setup
const STREAM_SERVICE_INITIAL_STATE = process.env.STREAM_SERVICE_INITIAL_STATE;
const MQTT_SERVICE_INITIAL_STATE = process.env.MQTT_SERVICE_INITIAL_STATE;
const ALERT_SERVICE_INITIAL_STATE = process.env.ALERT_SERVICE_INITIAL_STATE;
const HGITSORICAL_DATA_SERVICE_INITIAL_STATE = process.env.HGITSORICAL_DATA_SERVICE_INITIAL_STATE;

// Direct calls
if (STREAM_SERVICE_INITIAL_STATE == 'true'){
  rtspStreaming.loadRtspStream();
}
if (MQTT_SERVICE_INITIAL_STATE == 'true'){
  merakiSoundAlarmFunctionality.runMqtt();
}
if (ALERT_SERVICE_INITIAL_STATE == 'true'){
  DynamicAlerts.loadAlertService();
}
if (HGITSORICAL_DATA_SERVICE_INITIAL_STATE == 'true'){
  HistoricalData.loadHistoricalDataService();
}

module.exports = router;