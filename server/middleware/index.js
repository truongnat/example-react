const AuthMiddleware = require ("./auth.middleware");
const LoggerMiddleware = require ("./logger.middleware");
const ErrorsMiddleware = require ("./errors.middleware");
const SocketAuthMiddleware = require ("./socket-auth.middleware");

module.exports = {
	AuthMiddleware,
	LoggerMiddleware,
	ErrorsMiddleware,
	SocketAuthMiddleware,
};
