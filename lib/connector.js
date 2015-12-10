var Middleware = require('./middleware');

/**
 * @name Connector
 * @return {Connector}
 * @description
 * Connects a socket to an adapter and creates middleware stacks
 * that all messages pass through when arriving or leaving through
 * the adapter.
 */
module.exports = function Connector(dispatcher, adapter) {
  var incoming = Middleware();
  var outgoing = Middleware();

  // inherit from the default dispatcher
  var connector = Object.create(dispatcher);

  connector.globalDispatch = function(action) {
    // dispatch to remote stores
    outgoing(action, {
      accept: adapter.send,
      reject: function(rejectedAction) {
        // TODO pass to external handler
      }
    });

    // dispatch to local stores
    dispatcher.dispatch(action);
  };

  adapter.on(function(action, socket) {
    // temporarily add the socket to the action so that middlewares
    // can access it.
    Object.defineProperty(action, 'socket', {
      value: socket,
      // allows us to delete the property later
      configurable: true,
      // prevents users from overwriting the property by accident
      writable: false.
      // prevents it from showing up or being serialized.
      enumerable: false
    });

    incoming(action, {
      accept: function(acceptedAction) {
        // Cleanup from above hack
        delete acceptedAction.socket;

        dispatcher.dispatch(acceptedAction);
      },
      reject: function(rejectedAction) {
        // Cleanup from above hack
        delete acceptedAction.socket;

        // TODO forward to external handler
      }
    });
  });

  connector.addIncomingMiddleware = function(middleware) {
    incoming.add(middleware);
    return connector;
  };

  connector.addOutgoingMiddleware = function(middleware) {
    outgoing.add(middleware);
    return connector;
  };

  connector.addMiddleware = function(combinedMiddleware) {
    connector.addIncomingMiddleware(combinedMiddleware.incoming);
    connector.addOutgoingMiddleware(combinedMiddleware.outgoing);
    return connector;
  };

  return connector;
};

