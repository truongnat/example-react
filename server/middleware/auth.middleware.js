const jwt = require("jsonwebtoken");
require("dotenv").config();
const { UserRepository } = require("../schema");
const { UnauthorizedException, NotFoundException } = require("../exceptions");

async function AuthMiddleware(req, res, next) {
  try {
    const tokenClient = req.headers.authorization;

    if (!tokenClient) {
      return next(new UnauthorizedException());
    }
    const token = tokenClient.split(" ")[1];
    const validToken = jwt.verify(token, process.env.SECRET_KEY, {
      algorithms: ["HS256"],
    });

    if (!validToken) {
      return next(new UnauthorizedException());
    }

    const checkingUser = await UserRepository.findOne({ _id: validToken.id });
    if (!checkingUser) {
      return next(new NotFoundException("User not found!"));
    }
    req.user = {
      _id: checkingUser._id,
      username: checkingUser.username,
      avatar_url: checkingUser.avatar_url,
      createdAt: checkingUser.createdAt,
      updatedAt: checkingUser.updatedAt,
    };
    next();
  } catch (error) {
    next(new UnauthorizedException());
  }
}

module.exports = AuthMiddleware;
