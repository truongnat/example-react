const express = require("express");
const bcrypt = require("bcrypt");
const { UserRepository } = require("../schema");
require("dotenv").config();
const { ServerException, BadRequestException } = require("../exceptions");
const { AuthMiddleware } = require("../middleware");
const { Controller } = require("../core");
const { UserService } = require("../services");
const router = express.Router();

class UserController extends Controller {
  _path = "/user";
  _router = router;
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
    const { username, password, avatarUrl } = req.body;

    if (req.user.username !== username) {
      const existUsername = await UserRepository.findOne({ username });
      if (existUsername) {
        return next(new BadRequestException(`${username} already exist!`));
      }
    }

    let objUpdate = {};
    objUpdate.username = username;
    if (password) {
      objUpdate.password = await bcrypt.hash(password, 10);
    }
    if (avatarUrl) {
      objUpdate.avatarUrl = avatarUrl;
    }
    req.objUpdate = objUpdate;

    next();
  }

  async search(req, res, next) {
    const { username } = req.query;
    const results = await UserRepository.find({
      username: new RegExp(username, "i"),
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
