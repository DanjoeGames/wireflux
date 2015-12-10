var uid = require('uid');

module.exports = function IdentityMiddleware(propName, createUID) {
  propName = propName || 'id';
  createUID = createUID || uid;

  var socketToId = new Map();
  var idToSocket = new Map();

  function incoming(accept, reject) {
    return function(action) {
      var socket = action.socket;

      if(!socketToId.has(socket)) {
        var id = createUID();
        socketToId.set(socket, id);
        idToSocket.set(id, socket);
      }

      var id = socketToId.get(socket);
      action[propName] = id;
      accept(action);
    };
  }

  function outgoing(accept, reject) {
    return function(action) {
      if(propName in action) {
        var id = action[propName];
        var socket = idToSocket.get(id);
        reject(action);
        // ARGHHH! How do we send the action over the socket?
        // Don't want to have to patch the adapter on too!
        // This assumes that sockets have a send method, future
        // transport might not...
        socket.send();
      }
    };
  }

  return {
    incoming: incoming,
    outgoing: outgoing
  };
}

