const express = require("express");
const bcrypt = require("bcrypt");
const { UserRepository } = require("../schema");
require("dotenv").config();
const { ServerException, BadRequestException } = require("../exceptions");
const { AuthMiddleware } = require("../middleware");
const { Controller } = require("../core");
const { UserService } = require("../services");

class UserController extends Controller {
  _path = "/user";
  _router = express.Router();
  constructor() {
    super();
    this.initializeRoutes();
  }

  async update(req, res, next) {
    try {
      await UserService.updateUser(req.user._id, req.objUpdate);
      res.json({
        status: 200,
        message: "success",
      });
    } catch (error) {
      next(new ServerException(error.message));
    }
  }

  async formatDataBeforeUpdate(req, res, next) {
    const { email, password, avatarUrl, username } = req.body;

    if (req.user.email !== email) {
      const existUser = await UserRepository.findOne({ email });
      if (existUser) {
        return next(new BadRequestException(`${email} already exist!`));
      }
    }

    let objUpdate = {};
    if (password) {
      objUpdate.password = await bcrypt.hash(password, 10);
    }
    if (avatarUrl) {
      objUpdate.avatarUrl = avatarUrl;
    }
    if (username) {
      objUpdate.username = username;
    }
    req.objUpdate = objUpdate;

    next();
  }

  async search(req, res, next) {
    const { email } = req.query;
    const results = await UserRepository.find({
      email: new RegExp(email, "i"),
    });
    res.json({
      status: 200,
      message: "success",
      data: results,
    });
  }

  initializeRoutes() {
    this._router.get(`${this._path}/search`, this.search);
    this._router.put(
      `${this._path}/update`,
      AuthMiddleware,
      this.formatDataBeforeUpdate,
      this.update
    );
  }
}

module.exports = UserController;
