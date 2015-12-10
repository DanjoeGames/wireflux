module.exports = function regex(pattern) {
  return function(type) {
    return pattern.test(type);
  };
};

