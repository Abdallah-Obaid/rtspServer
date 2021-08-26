'use strict';
const superagent = require('superagent');
const CMS_URL = process.env.CMS_URL;
const SensorAlertSeverityEnum = require('../enum/sensorAlertSeverityEnum.js');
var helpers = {};

/** 
 * This function will send alerts to Cms DB
 */
helpers.alertSender= function(typeId,readingValue,readingStatus,alertSeverity,readingDate){
  superagent.post(`${CMS_URL}/Alerts/SaveAlert`)
    .send({ TypeId: typeId, Description: readingValue ,ReadingStatus: readingStatus,Severity: alertSeverity, AlarmDate: readingDate })
    // .set('Content-Type', 'application/x-www-form-urlencoded')
    .then(done => {
      console.log('Alert sent: ',{ TypeId: typeId, Description: readingValue ,ReadingStatus: readingStatus, Severity: alertSeverity, AlarmDate: readingDate });
      console.log('Alert sent: ',`${CMS_URL}/Alerts/SaveAlert`);
    })
    .catch(err => {
      console.log('Alert sending error: ', err);

    });
};

/** 
 * This function will get the thresholds for alerts from Cms DB
 */
helpers.getThresholds= async function() {
  var thresholdsData = await superagent.get(`${CMS_URL}/Alerts/GetAlertThresholds`)
    .then(thresholds => {
      return thresholds.body;
    })
    .catch(err => {
      console.log('Thresholds for alert error: ', err);
    });
  return thresholdsData;
};

/**
 * This function will send switch logs to CMS DB
 * @param {Number} typeId 
 * @param {Number} actionId 
 * @param {Number} userId 
 * @param {Number} roomId 
 * @param {Number} buildingId 
 */
helpers.switchLogGenerator= function(typeId,actionId,userId,roomId,buildingId){
  superagent.post(`${CMS_URL}/Dashboard/SaveLog`)
    .send({ TypeId: typeId, ActionId: actionId,ActionUserId:userId,VenueId:roomId,CampusId:buildingId })
    // .set('Content-Type', 'application/x-www-form-urlencoded')
    .then(done => {
      console.log('Log generated: ',typeId);
    })
    .catch(err => {
      console.log('Log generator error: ', err);
    });
};

/**
 * This function will save history for sensors and switches to CMS DB
 * @param {Number} typeId 
 * @param {Number} readingValue 
 * @param {Number} readingStatus 
 * @param {Date} readingDate 
 */
helpers.historicalDataGenerator= function(typeId,readingValue,readingStatus,readingDate){
  superagent.post(`${CMS_URL}/Alerts/SaveHistoryRecord`)
    .send({ TypeId: typeId, ReadingValue: readingValue ,ReadingStatus: readingStatus, ReadingDate: readingDate })
    // .set('Content-Type', 'application/x-www-form-urlencoded')
    .then(done => {
      console.log('Data appended sent: ',typeId);
    })
    .catch(err => {
      console.log('Historical data append error: ', err);
    });
};

/**
 * This function will calculate the severity
 * @param {Number} value 
 * @param {Number} severityWindow 
 * @param {Number} above 
 * @param {Number} bellow 
 * @returns Object
 */
helpers.getSeverity = function(value, severityWindow, above, bellow){
  var highA= above + 2*severityWindow;
  var highB = bellow - 2*severityWindow;
  var meduimA= above + 1*severityWindow;
  var meduimB = bellow - 1*severityWindow;
  var result;
  if (value > highA || value < highB){
    result = SensorAlertSeverityEnum.alertSeverity.high;
  }
  if ((value > meduimA && value <= highA) || ( value < meduimB && value >= highB)){
    result = SensorAlertSeverityEnum.alertSeverity.medium;
  }
  if ((value >= above && value <= meduimA) ||(value <= bellow && value >= meduimB)){
    result = SensorAlertSeverityEnum.alertSeverity.low;
  }
  if ((value > bellow  && value < above )){ //unused case
    result = SensorAlertSeverityEnum.alertSeverity.normal;
  }
  return result;
};

/**
 * This function will check for severity change
 * @param {Number} value 
 * @param {Number} severityWindow 
 * @param {Number} above 
 * @param {Number} bellow 
 * @param {Number} oldSeverity 
 */
helpers.checkSeverityChanged = function(value,severityWindow,above,bellow,oldSeverity){
  var result;
  var newSeverity = helpers.getSeverity(Number(value),severityWindow,above,bellow);
  if (oldSeverity == newSeverity){
    result = false;
  }
  else{
    result = true;  
  }
  return result;
};
module.exports = helpers;