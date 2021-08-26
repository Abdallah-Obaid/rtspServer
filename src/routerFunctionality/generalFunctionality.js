
'use strict';

// Application setup
const SENSORS_NUMBER = process.env.SENSORS_NUMBER;

// Global Vars

// Functions definitions
/** 
 * This function will return the sensors number
 * @param {obj} req 
 * @param {obj} res 
 * @param {function} next 
 */
var sensorsNumber = function (req, res, next) {
  if (SENSORS_NUMBER) { res.status(200).send(SENSORS_NUMBER); } else { res.status(200).send(0); }
};

var generalFunctionality = {};
generalFunctionality.sensorsNumber=sensorsNumber;
module.exports = generalFunctionality;