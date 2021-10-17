const jwt = require("jsonwebtoken");
require("dotenv").config();
const { UserRepo } = require("../schema/user.schema");

async function authMiddleware(req, res, next) {
  try {
    const cookieClient = req.headers.cookie;
    const validToken = jwt.verify(cookieClient, process.env.SECRET_KEY);
    if (!validToken) {
      return res.json({
        status: 401,
        message: "Invalid token",
      });
    }

    const checkingUser = await UserRepo.findOne({ _id: validToken.id });
    if (!checkingUser) {
      res.json({ status: 404, message: "Unauthorized" });
    }
    req.userId = validToken.id;
    next();
  } catch (error) {
    console.log("middleware cookie is error : ", error);
    return res.json({
      status: 500,
      message: error.message,
    });
  }
}

module.exports = { authMiddleware };
