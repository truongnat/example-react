class HttpException extends Error {
  status;
  message;
  errors;

  constructor(message, status, errors) {
    super(message, status);
    this.status = status;
    this.message = message;
    this.errors = errors;
  }
}

module.exports = HttpException;
