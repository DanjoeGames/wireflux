var Connector = require('./connector');
var adapter = require('./adapter');

var SocketClientAdapter = adapter.SocketClientAdapter;
var SocketServerAdapter = adapter.SocketServerAdapter;

module.exports = function connect(dispatcher) {
  return {
    from: function(server) {
      var adapter = SocketServerAdapter(server);
      return Connector(dispatcher, adapter);
    },
    to: function(socket) {
      var adapter = SocketClientAdapter(client);
      return Connector(dispatcher, adapter);
    }
  };
};

