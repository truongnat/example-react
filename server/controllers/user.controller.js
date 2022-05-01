const express = require("express");
const bcrypt = require("bcrypt");
const { UserRepo } = require("../schema/user.schema");
require("dotenv").config();
const { ServerException } = require("../exceptions");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

class UserController {
  _path = "/user";
  _router = router;
  constructor() {
    this.initializeRoutes();
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
        message: "success",
      });
    } catch (error) {
      next(new ServerException(error.message));
    }
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
    this._router.post(`${this._path}/update`, authMiddleware, this.update);
  }
}

module.exports = UserController;
