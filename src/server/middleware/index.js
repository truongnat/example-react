const jwt = require("jsonwebtoken");
require("dotenv").config();
const { UserRepo } = require("../schema/user.schema");

async function authMiddleware(req, res, next) {
  try {
    console.log("show header", req.headers);
    const cookieClient = req.headers.authorization;
    if (!cookieClient) {
      res.json({ status: 404, message: "Unauthorized" });
    }
    const token = cookieClient.split(" ")[1];
    const validToken = jwt.verify(token, process.env.SECRET_KEY, {
      algorithms: ["HS256"],
    });
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
