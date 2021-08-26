'use strict';
const superagent = require('superagent');
const SensorTypeEnum = require('../../enum/sensorTypeEnum.js');
const SensorAlertSeverityEnum = require('../../enum/sensorAlertSeverityEnum.js');
const helpers = require('../../helpers/helpers.js');
const ewelink = require('ewelink-api'); // For Ac switch
var MqttTester  = require('../mqtt/mqtt.js');

// Application setup
const CMS_URL = process.env.CMS_URL;
const IP_ADDRESS_FOR_FIBARO_SENSORS_MERAKI =  process.env.IP_ADDRESS_FOR_FIBARO_SENSORS_MERAKI;
const FIBARO_PASSWORD_MERAKI = process.env.FIBARO_PASSWORD_MERAKI;
const FIBARO_USER_NAME_MERAKI = process.env.FIBARO_USER_NAME_MERAKI;
const HISTORICAL_DATA_INTERVAL = process.env.HISTORICAL_DATA_INTERVAL;
const SONOFF_PASSWORD = process.env.SONOFF_PASSWORD;
const SONOFF_EMAIL = process.env.SONOFF_EMAIL;
const MERAKI_API_KEY = process.env.MERAKI_API_KEY;
const MERAKI_NETWORK_ID= process.env.MERAKI_NETWORK_ID;
const CO2_SENSOR_ID = process.env.CO2_SENSOR_ID;
const TEMPERATURE_SENSOR_SERIAL = process.env.TEMPERATURE_SENSOR_SERIAL;
const HUMIDITY_SENSOR_ID = process.env.HUMIDITY_SENSOR_ID;
const DUST_SENSOR_ID = process.env.DUST_SENSOR_ID;
const AMPERE_SENSOR_ID = process.env.AMPERE_SENSOR_ID;
const VOLT_SENSOR_ID = process.env.VOLT_SENSOR_ID;
const WATT_SENSOR_ID = process.env.WATT_SENSOR_ID;
const LIGHT_SWITCH_ID = process.env.LIGHT_SWITCH_ID;
const AC_SWITCH_ID = process.env.AC_SWITCH_ID;


// Global vars
var historicalData={};
var historicalDataServiceInterval;

/** 
 * This function will get the dust data and generator historical data from Fibaro sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
async function getDust() {
  var dustDeviceID = DUST_SENSOR_ID;
  superagent.get(`http://${IP_ADDRESS_FOR_FIBARO_SENSORS_MERAKI}/api/devices/${dustDeviceID}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .auth(FIBARO_USER_NAME_MERAKI, FIBARO_PASSWORD_MERAKI)
    .then(async dustData => {
      var dustObject = {};
      var dustDatavalue = dustData.body.properties.value;
      if (dustDatavalue ||dustDatavalue == 0) {
        var thresholds =await helpers.getThresholds();
        if (thresholds.dust.high >= Number(dustDatavalue) && Number(dustDatavalue) >= thresholds.dust.low) {
          dustObject.status=SensorAlertSeverityEnum.alertSeverity.normal;
        }
        if (thresholds.dust.high < Number(dustDatavalue)) {
          dustObject.status=SensorAlertSeverityEnum.alertSeverity.high;
        }
        if (Number(dustDatavalue) < thresholds.dust.low) {
          dustObject.status=SensorAlertSeverityEnum.alertSeverity.low;
        }
        helpers.historicalDataGenerator(SensorTypeEnum.sensorType.dust,Number(dustDatavalue),dustObject.status,new Date().toUTCString());

        dustObject.value=dustDatavalue;
      } 
  
    })
    .catch(err => {
      console.log('Dust alert sensor error: ', err);
    });
}

/** 
 * This function will get the data and generator historical data from Fibaro sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
async function getSmoke() {
  var co2DeviceID = CO2_SENSOR_ID;
  superagent.get(`http://${IP_ADDRESS_FOR_FIBARO_SENSORS_MERAKI}/api/devices/${co2DeviceID}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .auth(FIBARO_USER_NAME_MERAKI, FIBARO_PASSWORD_MERAKI)
    .then(async co2Data => {
      var co2Object = {};
      var co2Datavalue = co2Data.body.properties.value;
      if (co2Datavalue ||co2Datavalue == 0) {
        var thresholds =await helpers.getThresholds();
        if (thresholds.co2.high >= Number(co2Datavalue) && Number(co2Datavalue) >= thresholds.co2.low) {
          co2Object.status=SensorAlertSeverityEnum.alertSeverity.normal;
        }
        if (thresholds.co2.high < Number(co2Datavalue)) {
          co2Object.status=SensorAlertSeverityEnum.alertSeverity.high;
        }
        if (Number(co2Datavalue) < thresholds.co2.low) {
          co2Object.status=SensorAlertSeverityEnum.alertSeverity.low;
        }
        helpers.historicalDataGenerator(SensorTypeEnum.sensorType.co2,Number(co2Datavalue),co2Object.status,new Date().toUTCString());

        co2Object.value=co2Datavalue;
      } 
    })
    .catch(err => {
      console.log('Co2 alert sensor error: ', err);
    });
}

/** 
 * This function will get the temperature data and generate historical data from Meraki sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
async function getTemp() {
  var deviceSerial = TEMPERATURE_SENSOR_SERIAL;
  var merakiNetworkID = MERAKI_NETWORK_ID;
  var metric = 'temperature';
  superagent.get(`https://api.meraki.com/api/v1/networks/${merakiNetworkID}/sensors/stats/latestBySensor?metric=${metric}&serial=${deviceSerial}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('X-Cisco-Meraki-API-Key', MERAKI_API_KEY)
    .then(async temperatureData => {
      var temperatureObject = {};
      var temperatureDatavalue = temperatureData.body[0].value;
      if (temperatureDatavalue ||temperatureDatavalue == 0) {
        var thresholds =await helpers.getThresholds();
        if (thresholds.temperature.high >= Number(temperatureDatavalue) && Number(temperatureDatavalue) >= thresholds.temperature.low) {
          temperatureObject.status=SensorAlertSeverityEnum.alertSeverity.normal;
        }
        if (thresholds.temperature.high < Number(temperatureDatavalue)) {
          temperatureObject.status=SensorAlertSeverityEnum.alertSeverity.high;
        }
        if (Number(temperatureDatavalue) < thresholds.temperature.low) {
          temperatureObject.status=SensorAlertSeverityEnum.alertSeverity.low;
        }
        helpers.historicalDataGenerator(SensorTypeEnum.sensorType.temperature,Number(temperatureDatavalue),temperatureObject.status,new Date().toUTCString());

        temperatureObject.value=temperatureDatavalue;
      } 
    })
    .catch(err => {
      console.log('Temperature alert sensor error: ', err);
    });
}

/** 
 * This function will get the humidity data and generate historical data from Meraki sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
async function getHumidity() {
  var deviceSerial = HUMIDITY_SENSOR_ID;
  var merakiNetworkID = MERAKI_NETWORK_ID;
  var metric = 'humidity';
  superagent.get(`https://api.meraki.com/api/v1/networks/${merakiNetworkID}/sensors/stats/latestBySensor?metric=${metric}&serial=${deviceSerial}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('X-Cisco-Meraki-API-Key', MERAKI_API_KEY)
    .then(async humidityData => {
      var humidityObject = {};
      var humidityDatavalue = humidityData.body[0].value;
      if (humidityDatavalue ||humidityDatavalue == 0) {
        var thresholds =await helpers.getThresholds();
        if (thresholds.humidity.high >= Number(humidityDatavalue) && Number(humidityDatavalue) >= thresholds.humidity.low) {
          humidityObject.status=SensorAlertSeverityEnum.alertSeverity.normal;
        }
        if (thresholds.humidity.high < Number(humidityDatavalue)) {
          humidityObject.status=SensorAlertSeverityEnum.alertSeverity.high;
        }
        if (Number(humidityDatavalue) < thresholds.humidity.low) {
          humidityObject.status=SensorAlertSeverityEnum.alertSeverity.low;
        }
        helpers.historicalDataGenerator(SensorTypeEnum.sensorType.humidity,Number(humidityDatavalue),humidityObject.status,new Date().toUTCString());

        humidityObject.value=humidityDatavalue;
      } 
    })
    .catch(err => {
      console.log('Humidity alert sensor error: ', err);
    });
}

/** 
 * This function will get the data and generator historical data from Fibaro sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
async function getPower() {
  var powerDeviceID = WATT_SENSOR_ID;
  var powerDeviceIDAmpere = AMPERE_SENSOR_ID;
  var powerDeviceIDVolt = VOLT_SENSOR_ID;
  var powerObject = {};
  powerObject.value={};
  superagent.get(`http://${IP_ADDRESS_FOR_FIBARO_SENSORS_MERAKI}/api/devices?parentId=${powerDeviceID}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .auth(FIBARO_USER_NAME_MERAKI, FIBARO_PASSWORD_MERAKI)
    .then(powerData => {
      powerObject.status=SensorAlertSeverityEnum.alertSeverity.normal;
      const filterPowerData = powerData.body.filter((itemInArray) => {return (itemInArray.id == powerDeviceIDAmpere ||itemInArray.id == powerDeviceIDVolt)  ;});
      powerObject.value = Math.abs(filterPowerData[0].properties.value * filterPowerData[1].properties.value);
      helpers.historicalDataGenerator(SensorTypeEnum.sensorType.power,Number(powerObject.value),powerObject.status,new Date().toUTCString());
    })
    .catch(err => {
      console.log('Power alert sensor error: ', err);
    });
}

/** 
 * This function will save switch status from Fibaro sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
async function saveSwitchStatusHistorical() {
  var CheckSwitchStatusID = LIGHT_SWITCH_ID;
  superagent.get(`http://${IP_ADDRESS_FOR_FIBARO_SENSORS_MERAKI}/api/devices/${CheckSwitchStatusID}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .auth(FIBARO_USER_NAME_MERAKI, FIBARO_PASSWORD_MERAKI)
    .then(checkSwitchStatus => {
      var lightSwitch = {};
      // console.log('checkSwitchStatus', checkSwitchStatus.body.properties.value);
      if (checkSwitchStatus.body.properties.value) {
        if(checkSwitchStatus.body.properties.value=='true'){
          lightSwitch.value=1;
        }
        if(checkSwitchStatus.body.properties.value=='false'){
          lightSwitch.value=2;
        }
        lightSwitch.status=SensorAlertSeverityEnum.alertSeverity.normal;
        helpers.historicalDataGenerator(SensorTypeEnum.sensorType.lightSwitch,Number(lightSwitch.value),lightSwitch.status,new Date().toUTCString());

      } else {
        return []; 
      }
    })
    .catch(err => {
      console.log('Save switch status error: ', err);
    });
}

/** 
 * This function will sace Ac switch status from Fibaro sensor
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
async function saveAcSwitchStatusHistorical() {
  var CheckSwitchStatusID = AC_SWITCH_ID;
  var acSwitchObject={};
  const connection = new ewelink({
    email: SONOFF_EMAIL,
    password: SONOFF_PASSWORD,
    region: 'as',
  });
  try {
    const device = await connection.getDevice(CheckSwitchStatusID);
    // console.log('device.params',device.params);
    if(device.params){
      if (device.params.switch == 'on'){
        acSwitchObject.value = 1;
      }else if (device.params.switch == 'off'){
        acSwitchObject.value = 2;
      }
      acSwitchObject.status = SensorAlertSeverityEnum.alertSeverity.normal;
      helpers.historicalDataGenerator(SensorTypeEnum.sensorType.acSwitch,Number(acSwitchObject.value),acSwitchObject.status,new Date().toUTCString());
    }
  } 
  catch(err) {
    console.log('Save Ac switch status error: ', err);
  }
}

/** 
 * This function will save sound alarm from Meraki
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
async function saveFireAlarm() {
  try {
    if (MqttTester.soundAlarm == 'noFire') {
      MqttTester.value=1;
      MqttTester.status= SensorAlertSeverityEnum.alertSeverity.normal;
      helpers.historicalDataGenerator(SensorTypeEnum.sensorType.fire,Number(MqttTester.value),MqttTester.status,new Date().toUTCString());
    } else if (MqttTester.soundAlarm == 'fireAlarm') {
      MqttTester.value=1;
      MqttTester.status= SensorAlertSeverityEnum.alertSeverity.high;
      helpers.historicalDataGenerator(SensorTypeEnum.sensorType.fire,Number(MqttTester.value),MqttTester.status,new Date().toUTCString());
    }
  } catch (error){
    console.log('Save fire alarm error:' , error);
  }

}

/** 
 * This function will load historical data service
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
var loadHistoricalDataService= function(req, res, next){
  if(historicalDataServiceInterval){
    clearInterval(historicalDataServiceInterval);
  }
  historicalDataServiceInterval = setInterval(()=>{
    getDust();
    getSmoke();
    getTemp();
    getHumidity();
    getPower();
    saveSwitchStatusHistorical() ;
    saveAcSwitchStatusHistorical();
    if(MqttTester.soundAlarm){
      saveFireAlarm();
    }
  }, HISTORICAL_DATA_INTERVAL); 
  if(res){res.send('Start historical data service');} 
};

/** 
 * This function will stop historical data service
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
var stopHistoricalDataService = async function(req, res, next){
  if(historicalDataServiceInterval){
    clearInterval(historicalDataServiceInterval);
    historicalDataServiceInterval=null;
    res.send('Historical data service turned off');
  }else{
    res.send('Historical data service already off');
  }
};

historicalData.loadHistoricalDataService= loadHistoricalDataService;
historicalData.stopHistoricalDataService= stopHistoricalDataService;

module.exports = historicalData;