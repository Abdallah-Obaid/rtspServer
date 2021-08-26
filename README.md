
# Node.JS server for RTSP stream and sensors API docs

## Version: 1.1.0

## Description

This is a web API server build with nodeJS to handle the RTSP streaming/recording and get/post from/to Meraki, Fibaro, SonOff and Akuvox sensors in CMS IOT solution.

## MiddleWare

- 404.js: To handle the **Not Found** errors.
- 500.js: To handle the **Internal Server** errors.
- Timestamp.js: Add timestamp for each request.
- There are no middlewares for **Authentication/Authorization**.

## Models

- This API doesnt have any **DB** models.

# Network UML diagram

![UML](./docs/files/ciscoDashboardUML.png)

# Function docs

[jsdoc](https://abdallah-obaid.github.io/rtspServer/)

# Routes"End-points"

[Postman Collection](./docs/files/RTSP_Node_APIs.postman_collection.json)

# Services

- Node server now have four main services:

1. RTSP stream and record camera videos.
2. Alert service.
3. Sound alarm “Mqtt” service.
4. Save historical data to CMS DB service.

- You can active or deactivate any service from the “.env” file by toggle state from true-false or you can start or stop services using node.js API.

# Testing

- eslint: linting test

# Link

## [GitLab-link](http://192.168.2.36/cores/unified/tools/rtsp-server-nodejs)
