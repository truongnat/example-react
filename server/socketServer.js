const socket = require('socket.io');

class SocketServer {
  _io;
  constructor(server) {
    this._io = socket(server);
    this.initial();
  }

  initial() {
    this._io.on('connection', (sk) => {
      console.log('make socket connection');

      sk.on('validate_room', (data) => {
        console.log(data);
      });

      sk.on('disconnect', () => {
        this._io.emit('user_disconnected', 'user_disconnected');
      });
    });
  }
}

module.exports = SocketServer;
