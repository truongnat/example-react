const express = require("express");
const bcrypt = require("bcrypt");
const { UserRepo } = require("../schema/user.schema");
require("dotenv").config();
const { ServerException } = require("../exceptions");
const authMiddleware = require("../middleware/auth.middleware");
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
      await UserService.updateUser(req.userId, req.objUpdate);
      res.json({
        status: 200,
        message: "success",
      });
    } catch (error) {
      next(new ServerException(error.message));
    }
  }

  async formatDataBeforeUpdate(req, res, next) {
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
    req.objUpdate = objUpdate;

    next();
  }

  async search(req, res, next) {
    const { username } = req.query;
    const results = await UserRepo.find({
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
      authMiddleware,
      this.formatDataBeforeUpdate,
      this.update
    );
  }
}

module.exports = UserController;
