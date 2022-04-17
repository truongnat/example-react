const HttpException = require('./HttpException');

class UnauthorizedException extends HttpException {
  constructor() {
    super('Unauthorized', 401);
  }
}

module.exports = UnauthorizedException;
