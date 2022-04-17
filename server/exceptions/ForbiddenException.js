const HttpException = require('./HttpException');

class ForbiddenException extends HttpException {
  constructor() {
    super('Refuses to authorize', 403);
  }
}

module.exports = ForbiddenException;
