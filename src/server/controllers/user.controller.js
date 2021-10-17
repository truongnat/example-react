const { UserRepo } = require("../schema/user.schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
class UserController {
  async create(req, res) {
    const user = req.body;
    if (!user) {
      return res.json({
        status: 400,
        message: "user is not provider",
      });
    }
    if (!user["username"] || !user["password"]) {
      const errors = [];
      if (!user.username) {
        errors.push({
          field: "username",
          message: "username is not empty!",
        });
      }

      if (!user.password) {
        errors.push({
          field: "password",
          message: "password is not empty!",
        });
      }
      return res.json({
        status: 404,
        errors,
        message: "failure",
      });
    }
    try {
      const userExisting = await UserRepo.findOne({ username: user.username });
      if (userExisting) {
        return res.json({
          status: 404,
          message: "User already exists",
        });
      }
      const hasPassword = await bcrypt.hash(user.password, 10);
      await UserRepo.create({
        username: user.username,
        password: hasPassword,
      });
      res.json({
        status: 200,
        message: "success",
      });
    } catch (error) {
      console.log("Controller - create : ", error);
      res.json({
        status: 500,
        message: "server error",
      });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await UserRepo.findOne({ username: username });
      if (!user) {
        return res.json({
          status: 400,
          message: "User not found",
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.json({
          status: 400,
          message: "Password not matching!",
        });
      }
      const token = jwt.sign(
        {
          id: user._id,
          username: user.username,
          password: user.password,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "2d",
        }
      );
      res.setHeader("Set-Cookie", token);
      return res.json({
        status: 200,
        message: "success",
      });
    } catch (error) {
      console.log("Controller - login : ", error);
      res.json({
        status: 500,
        message: "server error",
      });
    }
  }

  async logout(req, res) {
    res.setHeader("Set-Cookie", `Authentication=; HttpOnly; Path=/; Max-Age=0`);
    res.json({
      status: 200,
      message: "success",
    });
  }
}

const userController = new UserController();

module.exports = { userController };
