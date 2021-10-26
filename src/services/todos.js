import { MemoryClient } from "../utils";

const { Api } = require("../config/api");

export class TodoService {
  userId = MemoryClient.get("anonymous_user");
  async create(data) {
    try {
      const { title, content, status } = data;
      const todo = {
        title,
        content,
        status,
        userId: this.userId,
      };
      const response = await new Api().post("todos/create", todo);
      return response.data;
    } catch (e) {
      console.log("error - create : ", e);
      return e;
    }
  }

  async getAllTodo() {
    try {
      const response = await new Api().fetch("todos/getAll");
      return response.data;
    } catch (e) {
      console.log("error - getAllTodo : ", e);
      return e;
    }
  }
  async updateTodo(data) {
    try {
      const response = await new Api().put("todos/update", data);
      return response.data;
    } catch (e) {
      console.log("error - updateTodo : ", e);
      return e;
    }
  }
  async deleteTodo(todoId) {
    try {
      const response = await new Api().delete("todos/delete", { id: todoId });
      return response.data;
    } catch (e) {
      console.log("error - deleteTodo : ", e);
      return e;
    }
  }
}
