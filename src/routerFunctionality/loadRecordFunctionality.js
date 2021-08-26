
'use strict';

const fs = require('fs');
const path = require('path');// to remove .mp4 from file name

// Application setup
const LOAD_RECOARD_DIRECTORY = process.env.LOAD_RECOARD_DIRECTORY;

// Global Vars

// Functions definitions
/** 
* This function will load the recorded video by name
* @param {obj} req 
* @param {obj} res 
* @param {function} next 
*/
var loadVideo = function (req, res, next) {
  var videoNameQ = req.query.videoName;
  const path = `${LOAD_RECOARD_DIRECTORY}/${videoNameQ}.mp4`;
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(path, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
};

/** 
* This function will send all the recorded video files-name
* @param {obj} req 
* @param {obj} res 
* @param {function} next 
*/
var recordList = function (req, res, next) {
  try {
    var filterDate = req.query.filterDate;
    console.log('filterDate:',filterDate);
    const testFolder = LOAD_RECOARD_DIRECTORY;
    var fullFileName = [];
    fs.readdir(testFolder, (err, files) => {
      files.forEach(file => {
        var fileNameWithoutExt = path.parse(file).name;
        var dateWithoutTime = fileNameWithoutExt.split('_')[0].split('-').join('/');
        if(filterDate==dateWithoutTime){
          fullFileName.push(fileNameWithoutExt);
        }
      });
      if (fullFileName) { res.status(200).send(fullFileName.reverse()); } else { res.status(200).send([]); }
    });

  } catch (error) {
    console.log('Record list error: ', error);
    res.status(403).send('Record list error');
  }
};

var loadRecordFunctionality = {};
loadRecordFunctionality.loadVideo=loadVideo;
loadRecordFunctionality.recordList=recordList;
module.exports = loadRecordFunctionality;