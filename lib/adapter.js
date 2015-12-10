/**
 * @name Adapter
 * @return {Adapter}
 *
 * @description
 * The adapter's job is to create standard interfaces for more
 * complex transport methods.
 *
 * @param {function} on
 * A function which accepts callback which will be called with any
 * contextual data that arrives over the transport.
 *
 * @param {function} send
 * A function which should accept data and send it over the transport.
 */
exports.Adapter = function Adapter(on, send) {
  return {
    on: on,
    send: send
  };
};

/**
 * @name SocketClientAdapter
 * @return {Adapter}
 * @description Turns a client side web socket object into an adapter.
 * @param {WebSocket} socket
 */
exports.SocketClientAdapter = function SocketClientAdapter(socket) {
  return Adapter(socket.on, socket.send);
};

/**
 * @name SocketServerAdapter
 * @return {Adapter}
 * @description Turns a web socket server into an adapter.
 * @param {WebSocketServer} server
 */
exports.SocketServerAdapter = function SocketServerAdapter(server) {
  var sockets = [];
  var callbacks = [];

  server.on('connection', function(socket) {
    sockets.push(socket);

    socket.on('message', function(message) {
      callbacks.forEach(function(callback) {
        callback(message, socket);
      });
    });
  });

  function on(callback) {
    callbacks.push(callback);
  }

  function send(message) {
    sockets.forEach(function(socket) {
      socket.send(message);
    });
  }

  return Adapter(on, send);
};

