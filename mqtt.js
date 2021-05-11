'use strict';
var mqtt  = require('mqtt');

var mqttFunc = function (topic,hostIP,clientId){
var topic =  topic;
var client  = mqtt.connect(hostIP,{clientId:clientId});
client.on('connect',function(){	
  console.log('connected');
  client.subscribe(topic,{qos:1});
  client.on('message',function(topic, message, packet){
    console.log("message",message)
    var jsonArr=JSON.parse(message);
    console.log("jsonArr",jsonArr)

  });
  client.on('error',function(error){ console.log('Can\'t connect'+error);});
  // client.end();
});

}
module.exports = 
{
  mqttFunc: mqttFunc,
};