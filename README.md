
# SENSORS-RTSP NODEJS SERVER FOR CISCO DASHBOARD

## Description

This is a web API build with nodeJS to handle the RTSP streaming and get/post from/to sensors in Meraki and Fibaro solutions.

## Project features

An attendance management system that lets you track your employers.
Time off and vacation tracking that allows teams to easily request time off, view balances, and get approval.

## MiddleWare

- 404.js: To handle the **Not Found** errors.
- 500.js: To handle the **Internal Server** errors.
- Timestamp.js: Add timestamp for each request.
- There are no middlewares for **Authentication/Authorization**.

## Models

- This API doesnt have any **DB** models.

# UML

[UML](https://lucid.app/publicSegments/view/4c87494b-17b0-444b-9a0f-b0d5a61931f8/image.png)

# Routes"End-points"

### get('/getTemperature?deviceID=27')

- This endpoint will return the instantaneous **Temperature** in real-time from **Fibaro** API.
  
- Example Response :
  > "24.40"

### get('/getSmoke?deviceID=31')

- This endpoint will return the instantaneous **Smoke Data**  "true/false" string in real-time from **Fibaro** API.
  
- Example Response :
  > "false"  

### get('/getPowerConsumption?deviceID=11')

- This endpoint will return the historical **Power Consumption Data**  "true/false" string until the real-time from **Fibaro** API.
  
- Example Response :
  > [
[
1619322755000,
0
],
[
1619352387000,
2
],
[
1619352397000,
24.3
],
]  

### get('/getWaterLeakTest?merakiNetworkID=L_676102894059002XXX&deviceSerial=Q3CB-F4C4-L9SF')

- This endpoint will return the instantaneous **Water Leak Test** result "true/false" string in real-time from **Meraki** API.
  
- Example Response :
  > "30.0"    

### get('/getDoorStatus?merakiNetworkID=L_676102894059002XXX&deviceSerial=Q3CC-WBJK-UAU7')
- This endpoint will return the historical **Door Status** result "0/1" until the real-time from **Meraki** API.

- Example Response :
  > [
  > {
  > "occurredAt": "2021-04-21T15:06:29.000000Z",
  > "networkId": "676102894059023230",
  > "type": "mt_door",
  > "description": "Door event",
  > "sensorSerial": "Q3CC-WBJK-UAU7",
  > "gatewaySerial": "Q2PV-NCFZ-QY79",
  > "eventData": {
  > "value": "0.0"
  > },
  > "lastMatchingEvent": {
  > "occurredAt": "2021-04-21T15:06:00.000000Z"
  > }
  > },
  > {
  > "occurredAt": "2021-04-21T15:06:00.000000Z",
  > "networkId": "676102894059023230",
  > "type": "mt_door",
  > "description": "Door event",
  > "sensorSerial": "Q3CC-WBJK-UAU7",
  > "gatewaySerial": "Q2PV-NCFZ-QY79",
  > "eventData": {
  > "value": "1.0"
  > },
  > "lastMatchingEvent": {
  > "occurredAt": "2021-04-13T13:51:22.000000Z"
  > }
  > },
  > ]

  ### get('/loadRtspStream')

- This endpoint will start the reading from **RTSP** stream "For a camera" and open a socket stream with front end.
  
- Example Response :
  > Video stream using socket protocol.   

### post('/postPowerSwitch')

- This endpoint will switch the light (on/off) **Fibaro** API.
- Example request :
  >  var deviceID = 11;
  >  var PowerSwitch = await $.ajax({
  >      method: 'POST',
  >      url: nodeHostURL + `/postPowerSwitch?` + $.param({deviceID: deviceID,   actionName: actionName}),
  >      data: {
  >          deviceID: deviceID,
  >          actionName: actionName,
  >      },
  >  });

- Example Response :
  >  {result: 0}


# Testing
- eslint

## rtspServer: [GitHub-link](https://github.com/Abdallah-Obaid/rtspServer)
