module.exports = function blacklist(types) {
  var list = new Set(types);

  return function(type) {
    var blacklistedType = list.has(type);

    return !blacklistedType;
  }
};

