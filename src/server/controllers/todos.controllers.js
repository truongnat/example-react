const {TodoRepo} = require("../schema/todo.schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {STATUS_TODO} = require("../constants");
require("dotenv").config();

class TodosController {
    async create(req, res) {
        const todo = req.body;
        if (!todo) {
            return res.json({
                status: 400,
                message: "todo is not provider",
            });
        }
        if (!todo["title"] || !todo["content"]) {
            const errors = [];
            if (!todo.title) {
                errors.push({
                    field: "title",
                    message: "title is not empty!",
                });
            }

            if (!todo.content) {
                errors.push({
                    field: "content",
                    message: "content is not empty!",
                });
            }
            return res.json({
                status: 404,
                errors,
                message: "failure",
            });
        }
        try {
            const todoCreated = await TodoRepo.create({
                title: todo.title,
                content: todo.content,
                status: "initial",
                userId: req.userId,
            });
            res.json({
                status: 200,
                message: "success",
                data: todoCreated,
            });
        } catch (error) {
            console.log("Controller - create : ", error);
            res.json({
                status: 500,
                message: error.message,
            });
        }
    }

    async getAll(req, res) {
        try {
            const status = req.query.status;
            const conditionsFilter = status ? {status: status} : {};
            const errors = [];
            if (status && !STATUS_TODO.includes(status)) {
                errors.push({
                    field: "status",
                    message:
                        "status is not matching [''initial'', ''todo'', ''review'', ''done'', ''keeping'']!",
                });
                return res.json({
                    status: 404,
                    errors,
                    message: "failure",
                });
            }
            const todos = await TodoRepo.find({userId: req.userId, ...conditionsFilter});
            return res.json({
                status: 200,
                message: "success",
                data: {
                    todos: todos,
                },
            });

            /*const perPage = 5;
            const page = req.query.page || 1;
            const status = req.query.status;
            const errors = [];
            if (status && !STATUS_TODO.includes(status)) {
              errors.push({
                field: "status",
                message:
                  "status is not matching [''initial'', ''todo'', ''review'', ''done'', ''keeping'']!",
              });
              return res.json({
                status: 404,
                errors,
                message: "failure",
              });
            }
            const conditionsFilter = status ? { status: status } : {};
            await TodoRepo.find({ userId: req.userId, ...conditionsFilter })
              .skip(perPage * page - perPage)
              .limit(perPage)
              .sort({ name: "asc" })
              .exec((_err, todos) => {
                TodoRepo.countDocuments((err, count) => {
                  if (err) return next(err);
                  return res.json({
                    status: 200,
                    message: "success",
                    data: {
                      todos: todos,
                      page: page,
                      count,
                    },
                  });
                });
              });*/
        } catch (error) {
            console.log("Controller - todo getAll : ", error);
            res.json({
                status: 500,
                message: error.message,
            });
        }
    }

    async update(req, res) {
        try {
            const todoUpdated = req.body;
            if (!todoUpdated) {
                return res.json({
                    status: 400,
                    message: "todo is not provider",
                });
            }
            const errors = [];
            if (todoUpdated.status && !STATUS_TODO.includes(todoUpdated.status)) {
                errors.push({
                    field: "status",
                    message:
                        "status is not matching [''initial'', ''todo'', ''review'', ''done'', ''keeping'']!",
                });
                return res.json({
                    status: 404,
                    errors,
                    message: "failure",
                });
            }

            const todoExists = await TodoRepo.findOne({_id: todoUpdated.id});
            if (!todoExists) {
                return res.json({
                    status: 404,
                    message: "todo not found",
                });
            }
            await TodoRepo.updateOne(
                {_id: todoUpdated.id},
                {
                    title: todoUpdated.title || todoExists.title,
                    content: todoUpdated.content || todoExists.content,
                    status: todoUpdated.status || todoUpdated.status,
                }
            );

            return res.json({
                status: 200,
                message: "success",
            });
        } catch (error) {
            console.log("Controller - todo update : ", error);
            res.json({
                status: 500,
                message: error.message,
            });
        }
    }

    async delete(req, res) {
        try {
            const todoId = req.params.todoId;
            const todoExists = await TodoRepo.findOne({_id: todoId});
            if (!todoExists) {
                return res.json({
                    status: 404,
                    message: "todo not found",
                });
            }
            await TodoRepo.deleteOne({_id: todoId});
            res.json({
                status: 200,
                message: "success",
            });
        } catch (error) {
            console.log("Controller - todo delete : ", error);
            res.json({
                status: 500,
                message: error.message,
            });
        }
    }
}

const todosController = new TodosController();

module.exports = {todosController};
