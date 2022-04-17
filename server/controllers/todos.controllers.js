const { TodoRepo } = require('../schema/todo.schema');
const express = require('express');
const { STATUS_TODO } = require('../constants');
const {
  BadRequestException,
  ServerException,
  NotFoundException,
} = require('../exceptions');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

class TodosController {
  _path = '/todos';
  _router = router;

  constructor() {
    this.initializeRoutes();
  }

  async create(req, res, next) {
    const todo = req.body;
    if (!todo) {
      return res.json({
        status: 400,
        message: 'todo is not provider',
      });
    }
    if (!todo['title'] || !todo['content']) {
      const errors = [];
      if (!todo.title) {
        errors.push({
          field: 'title',
          message: 'title is not empty!',
        });
      }

      if (!todo.content) {
        errors.push({
          field: 'content',
          message: 'content is not empty!',
        });
      }
      return next(new BadRequestException('create todo failure', errors));
    }
    try {
      const todoCreated = await TodoRepo.create({
        title: todo.title,
        content: todo.content,
        status: 'initial',
        userId: req.userId,
      });
      res.json({
        status: 200,
        message: 'success',
        data: todoCreated,
      });
    } catch (error) {
      next(new ServerException(error.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const status = req.query.status;
      const conditionsFilter = status ? { status: status } : {};
      const errors = [];
      if (status && !STATUS_TODO.includes(status)) {
        errors.push({
          field: 'status',
          message:
            "status is not matching [''initial'', ''todo'', ''review'', ''done'', ''keeping'']!",
        });
        return next(new BadRequestException('getAll todo failure', errors));
      }
      const todos = await TodoRepo.find({
        userId: req.userId,
        ...conditionsFilter,
      });
      return res.json({
        status: 200,
        message: 'success',
        data: {
          todos: todos,
        },
      });
    } catch (error) {
      next(new ServerException(error.message));
    }
  }

  async update(req, res, next) {
    try {
      const todoUpdated = req.body;
      if (!todoUpdated) {
        return next(new BadRequestException('todo is not provider'));
      }
      const errors = [];
      if (todoUpdated.status && !STATUS_TODO.includes(todoUpdated.status)) {
        errors.push({
          field: 'status',
          message:
            "status is not matching [''initial'', ''todo'', ''review'', ''done'', ''keeping'']!",
        });
        return next(new BadRequestException('getAll todo failure', errors));
      }

      const todoExists = await TodoRepo.findOne({ _id: todoUpdated.id });
      if (!todoExists) {
        return next(new NotFoundException('todo not found'));
      }
      await TodoRepo.updateOne(
        { _id: todoUpdated.id },
        {
          title: todoUpdated.title || todoExists.title,
          content: todoUpdated.content || todoExists.content,
          status: todoUpdated.status || todoUpdated.status,
        }
      );

      return res.json({
        status: 200,
        message: 'success',
      });
    } catch (error) {
      next(new ServerException(error.message));
    }
  }

  async delete(req, res, next) {
    try {
      const todoId = req.params.todoId;
      const todoExists = await TodoRepo.findOne({ _id: todoId });
      if (!todoExists) {
        return next(new NotFoundException('todo not found'));
      }
      await TodoRepo.deleteOne({ _id: todoId });
      res.json({
        status: 200,
        message: 'success',
      });
    } catch (error) {
      next(new ServerException(error.message));
    }
  }

  initializeRoutes() {
    this._router
      .all(`${this._path}/*`, authMiddleware)
      .get(`${this._path}/getAll`, this.getAll)
      .post(`${this._path}/create`, this.create)
      .put(`${this._path}/update`, this.update)
      .delete(`${this._path}/delete/:todoId`, this.delete);
  }
}

module.exports = TodosController;
