'use strict';
var mqtt  = require('mqtt');
const SensorTypeEnum = require('../../enum/sensorTypeEnum.js');
const SensorAlertSeverityEnum = require('../../enum/sensorAlertSeverityEnum');
const helpers = require('../../helpers/helpers');

// Global vars
var MqttTester={};
var soundAlarm = 'noFire';
var switchOff = 20000; // 20sec
var allowedTimeSecDiff = 10; // Its clear on name
var client;
MqttTester.soundAlarm=soundAlarm;

/**
 * This function will start Mqtt service
 * @param {String} topic 
 * @param {String} hostIP 
 * @param {String} port 
 * @param {String} clientId 
 */
var mqttFunc = function (topic,hostIP,port,clientId){
  // var topic =  topic;
  var options = {
    port: port,
    clientId: clientId,

  };
  if(client){client.end();}
  client  = mqtt.connect(hostIP,port,options);
  client.on('connect',function(){	
    console.log('connected');
    client.subscribe(topic,{qos:1});
    client.on('message',function(topic, message, packet){
    // console.log("message",message)
      var jsonArr=JSON.parse(message);
      console.log('jsonArr',jsonArr);
      //  if (jsonArr.class == "fireAlarm"){
      //   if(jsonArr.objects){
      //     if (jsonArr.objects[0]) {
      //     if (jsonArr.objects[0].type == "person"){
      //       // console.log("fireAlarm")
      //       soundAlarm = 'fireAlarm';
      //       MqttTester.soundAlarm=soundAlarm;
      //   }
      // }
      if(jsonArr){
        var dateNowSec = Math.floor(new Date().getTime() / 1000);
        var timeDiff = dateNowSec-Math.floor(jsonArr.ts);
        // console.log(timeDiff);
        if (jsonArr.class == 'fireAlarm' && (timeDiff <= allowedTimeSecDiff) ){
        // console.log("fireAlarm")
          soundAlarm = 'fireAlarm';
          // console.log(soundAlarm);
          MqttTester.soundAlarm=soundAlarm;
          helpers.alertSender(SensorTypeEnum.sensorType.fire,'fireAlarm',SensorAlertSeverityEnum.alertSeverity.high,new Date());

          setTimeout(()=>{
            soundAlarm = 'noFire'; 
            // console.log(soundAlarm);
            MqttTester.soundAlarm=soundAlarm;        
          },switchOff);
        }
      }else{
      // console.log("noFire")
        soundAlarm = 'noFire';
        MqttTester.soundAlarm=soundAlarm;
      }



    });
    client.on('error',function(error){ console.log('Can\'t connect'+error);});
  // client.end();
  });

};

// { objects:
//   [ { confidence: 53,
//       frame: 18201699,
//       oid: 837,
//       type: 'person',
//       x0: 0.639,
//       x1: 0.577,
//       y0: 0.283,
//       y1: 0.184 } ],
//  ts: 1622027970650 }

/**
 * This function used to stop Mqtt service
 * @returns String
 */
var stopMqtt = function (){
  if(client){client.end();
    client=null;
    return 'Mqtt service stopped successfully';
  }else{
    return 'Mqtt service already closed';
  }
};

MqttTester.mqttFunc=mqttFunc;
MqttTester.stopMqtt=stopMqtt;
module.exports = MqttTester;