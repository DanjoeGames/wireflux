var asyncReduce = require('./util/async-reduce');

module.exports = function Middleware() {
  var middlewares = []

  function apply(accept, reject, action) {
    if(middlewares.length === 0) {
      return accept(action);
    }

    asyncReduce(middlewares, function(action, middleware, next) {
      // (accept, reject) -> action
      middleware(next, reject)(action);
    }, action, accept);
  }

  var middleware = apply;

  middleware.add = function(middleware) {
    middlewares.push(middleware);
  };

  return middleware;
};

