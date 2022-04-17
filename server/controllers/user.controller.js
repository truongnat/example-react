const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserRepo } = require('../schema/user.schema');
require('dotenv').config();
const {
  BadRequestException,
  ServerException,
  NotFoundException,
} = require('../exceptions');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

class UserController {
  _path = '/auth';
  _router = router;

  constructor() {
    this.initializeRoutes();
  }

  async create(req, res, next) {
    const user = req.body;
    if (!user) {
      return next(new BadRequestException('user is not provider'));
    }
    if (!user['username'] || !user['password']) {
      const errors = [];
      if (!user.username) {
        errors.push({
          field: 'username',
          message: 'username is not empty!',
        });
      }

      if (!user.password) {
        errors.push({
          field: 'password',
          message: 'password is not empty!',
        });
      }
      return next(new NotFoundException('failure', errors));
    }
    try {
      const userExisting = await UserRepo.findOne({ username: user.username });
      if (userExisting) {
        return next(new BadRequestException('User already exists'));
      }
      const hashPassword = await bcrypt.hash(user.password, 10);
      await UserRepo.create({
        username: user.username,
        password: hashPassword,
        avatar_url: '',
      });
      res.json({
        status: 200,
        message: 'success',
      });
    } catch (error) {
      next(new ServerException(error.message));
    }
  }

  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const user = await UserRepo.findOne({ username: username });
      if (!user) {
        return next(new BadRequestException('User not found'));
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return next(new BadRequestException('Password not matching!'));
      }
      const token = await jwt.sign(
        {
          id: user._id,
          username: user.username,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: '7d',
          algorithm: 'HS256',
        }
      );
      return res.json({
        status: 200,
        message: 'success',
        data: {
          access_token: token,
          user: {
            username: user.username,
            id: user._id,
          },
        },
      });
    } catch (error) {
      next(new ServerException(error.message));
    }
  }

  async logout(req, res, next) {
    res.setHeader('Set-Cookie', `Authentication=; HttpOnly; Path=/; Max-Age=0`);
    res.json({
      status: 200,
      message: 'success',
    });
  }

  async checkingMe(req, res, next) {
    try {
      const user = await UserRepo.findOne({ _id: req.userId });
      const response = {
        _id: user._id,
        username: user.username,
        createdAt: user.createdAt,
        avatar_url: user?.avatar_url,
        updatedAt: user.updatedAt,
      };
      if (!user) {
        return next(
          new BadRequestException('username or password not matching!')
        );
      }
      return res.json({
        status: 200,
        message: 'success',
        data: response,
      });
    } catch (e) {
      next(new ServerException(error.message));
    }
  }

  async update(req, res, next) {
    const userInfo = req.body;

    let objUpdate = {};
    if (userInfo.username) {
      objUpdate.username = userInfo.username;
    }
    if (userInfo.password) {
      objUpdate.password = await bcrypt.hash(userInfo.password, 10);
    }
    if (userInfo.avatar_url) {
      objUpdate.avatar_url = userInfo.avatar_url;
    }
    try {
      await UserRepo.updateOne({ _id: req.userId }, { ...objUpdate });
      res.json({
        status: 200,
        message: 'success',
      });
    } catch (error) {
      next(new ServerException(error.message));
    }
  }

  initializeRoutes() {
    this._router.post(`${this._path}/register`, this.create);
    this._router.post(`${this._path}/login`, this.login);
    this._router.post(`${this._path}/logout`, this.logout);
    this._router.get(
      `${this._path}/checking-me`,
      authMiddleware,
      this.checkingMe
    );
    this._router.post(`${this._path}/update`, authMiddleware, this.update);
  }
}

module.exports = UserController;
