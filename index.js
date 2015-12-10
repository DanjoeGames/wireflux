var connect = require('./lib/connect');
var barrier = require('./middleware/barrier');
var identity = require('./middleware/identity');
var util = require('./lib/util');

var wireflux = {
  connect: connect,
  barrier: barrier,
  identity: identity
};

