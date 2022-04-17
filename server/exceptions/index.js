const HttpException = require('./HttpException');
const BadRequestException = require('./BadRequestException');
const ForbiddenException = require('./ForbiddenException');
const NotFoundException = require('./NotFoundException');
const ServerException = require('./ServerException');
const UnauthorizedException = require('./UnauthorizedException');

module.exports = {
  HttpException,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  ServerException,
  UnauthorizedException,
};
