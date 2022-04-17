const jwt = require('jsonwebtoken');
require('dotenv').config();
const { UserRepo } = require('../schema/user.schema');
const {
  UnauthorizedException,
  NotFoundException,
  ServerException,
} = require('../exceptions');

async function authMiddleware(req, res, next) {
  try {
    const cookieClient = req.headers.authorization;
    if (!cookieClient) {
      return next(new UnauthorizedException());
    }
    const token = cookieClient.split(' ')[1];
    const validToken = jwt.verify(token, process.env.SECRET_KEY, {
      algorithms: ['HS256'],
    });
    if (!validToken) {
      return next(new UnauthorizedException());
    }

    const checkingUser = await UserRepo.findOne({ _id: validToken.id });
    if (!checkingUser) {
      return next(new NotFoundException('User not found!'));
    }
    req.userId = validToken.id;
    next();
  } catch (error) {
    next(new UnauthorizedException());
  }
}

module.exports = authMiddleware;
