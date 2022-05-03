const { Service } = require("../core");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class AuthService extends Service {
  async generateToken(data) {
    return await jwt.sign(data, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRED,
      algorithm: "HS256",
    });
  }

  async generateRefreshToken(data) {
    return await jwt.sign(data, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_REFRESH_EXPIRED,
      algorithm: "HS256",
    });
  }
}

module.exports = new AuthService();
