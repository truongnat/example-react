const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserRepository } = require("../schema");
const {
  ServerException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} = require("../exceptions");
const { AuthMiddleware } = require("../middleware");
const { Controller } = require("../core");
const { UserService, AuthService } = require("../services");
const router = express.Router();

class AuthController extends Controller {
  _path = "/auth";
  _router = router;
  constructor() {
    super();
    this.initializeRoutes();
  }

  async registerAccount(req, res, next) {
    const user = req.body.user;
    try {
      const userExisting = await UserRepository.findOne({
        username: user.username,
      });
      if (userExisting) {
        return next(new BadRequestException("User already exists"));
      }
      await UserService.createUser(user);
      res.json({
        status: 200,
        message: "success",
      });
    } catch (error) {
      next(new ServerException(error.message));
    }
  }

  async login(req, res, next) {
    try {
      const { username, _id } = req.user;

      const payload = {
        id: _id,
        username,
      };

      const token = await AuthService.generateToken(payload);

      await UserRepository.updateOne({ _id }, { oldToken: token });
      return res.json({
        status: 200,
        message: "success",
        data: {
          access_token: token,
          user: payload,
        },
      });
    } catch (error) {
      next(new ServerException(error.message));
    }
  }

  async logout(req, res, next) {
    res.setHeader("Set-Cookie", `Authentication=; HttpOnly; Path=/; Max-Age=0`);
    res.json({
      status: 200,
      message: "success",
    });
  }

  async checkingMe(req, res, next) {
    try {
      return res.json({
        status: 200,
        message: "success",
        data: await UserService.getUserById(req.userId),
      });
    } catch (e) {
      next(new ServerException(error.message));
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { _id, username } = req.user;

      const newToken = await AuthService.generateToken({
        id: _id,
        username,
      });

      await UserRepository.updateOne({ _id: id }, { oldToken: newToken });
      return res.json({
        status: 200,
        message: "success",
        data: {
          access_token: newToken,
        },
      });
    } catch (error) {
      next(new UnauthorizedException());
    }
  }

  async validateBeforeCreateAccount(req, res, next) {
    const user = req.body.user;
    if (!user) {
      return next(new BadRequestException("User is not provider"));
    }
    const { username, password } = user;
    if (!username || !password) {
      const errors = [];
      if (!user.username) {
        errors.push({
          field: "username",
          message: "Username is not empty!",
        });
      }

      if (!user.password) {
        errors.push({
          field: "password",
          message: "Password is not empty!",
        });
      }
      return next(new NotFoundException("failure", errors));
    }

    next();
  }

  async validateBeforeLogin(req, res, next) {
    const { username, password } = req.body;
    const user = await UserRepository.findOne({ username: username });
    if (!user) {
      return next(new BadRequestException("User not found"));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new BadRequestException("Password not matching!"));
    }

    req.user = user;
    next();
  }

  async validateBeforeRefreshToken(req, res, next) {
    const { oldToken } = req.body;
    const decoded = jwt.decode(oldToken);
    if (!decoded) {
      return next(new BadRequestException("Bad request!"));
    }

    const { id } = decoded;

    const userExist = await UserRepository.findOne({ _id: id });

    if (!userExist) {
      return next(new NotFoundException("User not found"));
    }

    if (userExist.oldToken !== oldToken) {
      return next(new BadRequestException("OldToken invalid!"));
    }

    req.user = userExist;

    next();
  }

  initializeRoutes() {
    this._router.post(
      `${this._path}/register`,
      this.validateBeforeCreateAccount,
      this.registerAccount
    );
    this._router.post(
      `${this._path}/login`,
      this.validateBeforeLogin,
      this.login
    );
    this._router.post(`${this._path}/logout`, this.logout);
    this._router.post(`${this._path}/refresh-token`, this.refreshToken);
    this._router.get(
      `${this._path}/checking-me`,
      AuthMiddleware,
      this.checkingMe
    );
  }
}

module.exports = AuthController;
