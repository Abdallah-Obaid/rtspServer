'use strict';

module.exports = (req, res, next) => {
  res.status(404);
  res.send({err: 'Page you are looking for is not found'});
  // next();
};