const AuthMiddleware = require("./auth.middleware");
const LoggerMiddleware = require("./logger.middleware");
const ErrorsMiddleware = require("./errors.middleware");

module.exports = {
  AuthMiddleware,
  LoggerMiddleware,
  ErrorsMiddleware,
};
