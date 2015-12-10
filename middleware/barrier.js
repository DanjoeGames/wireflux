module.exports = function BarrierMiddleware(rules) {
  return function(accept, reject) {
    return function(action) {
      var passed = rules.reduce(function(passing, rule) {
        return passing && rule(action.type);
      }, true);

      passed ? accept(action) : reject(action);
    };
  };
};

