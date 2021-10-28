const express = require("express");
const router = express.Router();
const { todosController } = require("../controllers/todos.controllers");
const { authMiddleware } = require("../middleware");

router.post("/create", authMiddleware, todosController.create);
router.get("/getAll", authMiddleware, todosController.getAll);
router.put("/update", authMiddleware, todosController.update);
router.delete("/delete/:todoId", authMiddleware, todosController.delete);

module.exports = router;
