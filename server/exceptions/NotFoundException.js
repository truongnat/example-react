const HttpException = require('./HttpException');

class NotFoundException extends HttpException {
  constructor(message, errors = {}) {
    super(message || 'NotFoundException', 404, errors);
  }
}

module.exports = NotFoundException;
