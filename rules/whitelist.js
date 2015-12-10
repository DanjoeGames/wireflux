var blacklist = require('./blacklist');

module.exports = function whitelist(types) {
  var list = blacklist(types);

  return function(type) {
    return !list(type);
  };
};

