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
      return res.json({
        status: 200,
        message: "success",
      });
    } catch (error) {
      next(new ServerException(error.message));
    }
  }

  async formatDataBeforeUpdate(req, res, next) {
    const {
      username,
      newPassword: password,
      currentPassword,
      avatarUrl,
    } = req.body;

    // need re-query because req.user does not include password
    const getUser = await UserRepository.findOne({ email: req.user.email });
    console.log(req.user);

    let objUpdate = {};
    if (password) {
      const isMatch = await bcrypt.compare(currentPassword, getUser.password);

      if (!isMatch) {
        return next(new BadRequestException("Password incorrect!"));
      }
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
      _id: { $ne: req.user._id },
      email: new RegExp(email, "i"),
    });
    res.json({
      status: 200,
      message: "success",
      data: results,
    });
  }

  initializeRoutes() {
    this._router.get(`${this._path}/search`, AuthMiddleware, this.search);
    this._router.put(
      `${this._path}/update`,
      AuthMiddleware,
      this.formatDataBeforeUpdate,
      this.update
    );
  }
}

module.exports = UserController;
