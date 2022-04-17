const HttpException = require('./HttpException');

class ServerException extends HttpException {
  constructor(message, errors = {}) {
    super(message || 'Server Internal Error', 500, errors);
  }
}

module.exports = ServerException;
