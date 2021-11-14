const express = require("express");
const router = express.Router();
const {userController} = require("../controllers/user.controller");
const {authMiddleware} = require("../middleware");

router.post("/register", userController.create);
router.post("/login", userController.login);
router.get("/checking-me", authMiddleware, userController.checkingMe);
router.post('/update', authMiddleware, userController.update)
router.get("/logout", userController.logout);

module.exports = router;
