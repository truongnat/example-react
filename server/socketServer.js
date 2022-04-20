const socket = require('socket.io');

class SocketServer {
  _io;
  constructor(server) {
    this._io = socket(server, {
      cors: this.buildCorsOptWs(),
    });
    this.initial();
  }

  buildCorsOptWs() {
    const configCors = process.env.CORS_ALLOW_ORIGINS_WS;
    if (!configCors) {
      throw new Error('ENV CORS not provider!');
    }
    return {
      origin: configCors.toString().split(','),
      credentials: true,
    };
  }

  initial() {
    this._io.on('connection', (sk) => {
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
