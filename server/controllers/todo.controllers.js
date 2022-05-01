const express = require("express");
const { STATUS_TODO } = require("../constants");
const {
  BadRequestException,
  ServerException,
  NotFoundException,
} = require("../exceptions");
const authMiddleware = require("../middleware/auth.middleware");
const { TodoRepo } = require("../schema/todo.schema");
const { TodoService } = require("../services");
const router = express.Router();

class TodoController {
  _path = "/todo";
  _router = router;

  constructor() {
    this.initializeRoutes();
  }

  async create(req, res, next) {
    const todo = req.body;
    try {
      const todoCreated = await TodoService.createTodo(req.userId, todo);
      res.json({
        status: 200,
        message: "success",
        data: todoCreated,
      });
    } catch (error) {
      next(new ServerException(error.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const status = req.query.status;
      const errors = [];
      if (status && !STATUS_TODO.includes(status)) {
        errors.push({
          field: "status",
          message:
            "status is not matching [''initial'', ''todo'', ''review'', ''done'', ''keeping'']!",
        });
        return next(new BadRequestException("getAll todo failure", errors));
      }

      const todoList = await TodoService.getAllTodo(req.userId, status);

      return res.json({
        status: 200,
        message: "success",
        data: {
          todos: todoList,
        },
      });
    } catch (error) {
      next(new ServerException(error.message));
    }
  }

  async update(req, res, next) {
    try {
      const todoUpdated = req.body;
      const todoId = req.params.todoId;

      if (!todoUpdated) {
        return next(new BadRequestException("todo is not provider"));
      }
      const errors = [];
      if (todoUpdated.status && !STATUS_TODO.includes(todoUpdated.status)) {
        errors.push({
          field: "status",
          message:
            "status is not matching [''initial'', ''todo'', ''review'', ''done'', ''keeping'']!",
        });
        return next(new BadRequestException("update todo failure", errors));
      }

      await TodoService.updateTodo(todoId, todoUpdated);

      return res.json({
        status: 200,
        message: "success",
      });
    } catch (error) {
      next(new ServerException(error.message));
    }
  }

  async delete(req, res, next) {
    try {
      const todoId = req.params.todoId;

      await TodoService.deleteTodo(todoId);
      res.json({
        status: 200,
        message: "success",
      });
    } catch (error) {
      next(new ServerException(error.message));
    }
  }

  async validateBeforeCreate(req, res, next) {
    const todo = req.body;
    if (!todo) {
      return res.json({
        status: 400,
        message: "Todo is not provider",
      });
    }

    const { title, content } = todo;

    if (!title || !content) {
      const errors = [];
      if (!todo.title) {
        errors.push({
          field: "title",
          message: "Title is not empty!",
        });
      }

      if (!todo.content) {
        errors.push({
          field: "content",
          message: "Content is not empty!",
        });
      }
      return next(new BadRequestException("create todo failure", errors));
    }

    const todoExists = await TodoRepo.findOne({ title });

    if (todoExists) {
      return next(
        new BadRequestException(`Todo with title: ${title} duplicate`)
      );
    }

    next();
  }

  async validateBeforeUpdateOrDelete(req, res, next) {
    const _id = req.params.todoId;
    const todoExists = await TodoRepo.findOne({ _id });

    if (!todoExists) {
      return next(new NotFoundException(`Todo with id: ${_id} not found`));
    }

    next();
  }

  initializeRoutes() {
    this._router
      .all(`${this._path}/*`, authMiddleware)
      .get(`${this._path}/getAll`, this.getAll)
      .post(`${this._path}/create`, this.validateBeforeCreate, this.create)
      .put(
        `${this._path}/update/:todoId`,
        this.validateBeforeUpdateOrDelete,
        this.update
      )
      .delete(
        `${this._path}/delete/:todoId`,
        this.validateBeforeUpdateOrDelete,
        this.delete
      );
  }
}

module.exports = TodoController;
