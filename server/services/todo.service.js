const { ENUM_STATUS_TODO } = require("../constants");
const { Service } = require("../core");
const { NotFoundException } = require("../exceptions");
const { TodoRepository } = require("../schema");

class TodoService extends Service {
  async createTodo(userId, { title, content }) {
    try {
      const todoExists = await TodoRepository.findOne({ title });

      if (todoExists) {
        throw new NotFoundException(`todo with ${title} duplicate`);
      }

      return await TodoRepository.create({
        title,
        content,
        userId,
        status: ENUM_STATUS_TODO.INIT,
      });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async getAllTodo(userId, status) {
    try {
      const conditionsFilter = status ? { status } : {};
      return await TodoRepository.find({
        userId,
        ...conditionsFilter,
      });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async updateTodo(_id, { title, content, status }) {
    try {
      return await TodoRepository.findByIdAndUpdate(
        { _id },
        {
          title: title,
          content: content,
          status: status,
        }
      );
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async deleteTodo(_id) {
    try {
      return await TodoRepository.findOneAndDelete({ _id });
    } catch (e) {
      throw new Error(e.message);
    }
  }
}

module.exports = new TodoService();
