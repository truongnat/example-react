import { MemoryClient } from "../utils";

export class TodoService {
  _path = "/todo";
  _axios;
  _userId = MemoryClient.get("anonymous_user");

  constructor(axiosInstance) {
    this._axios = axiosInstance;
  }

  async createTodo(data) {
    try {
      const todo = {
        ...data,
        userId: this.userId,
      };
      return await this._axios.post(`${this._path}/create`, todo);
    } catch (e) {
      console.log("🚀 ~ file: todoService.js ~ line 22 ~ TodoService ~ e", e);
      return e;
    }
  }

  async getAllTodo(status = "") {
    try {
      return this._axios.fetch(`${this._path}/getAll?status=${status}`);
    } catch (e) {
      console.log("🚀 ~ file: todoService.js ~ line 34 ~ TodoService ~ e", e);
      return e;
    }
  }

  async updateTodo(data) {
    try {
      return await this._axios.put(`${this._path}/update/${data.id}`, data);
    } catch (e) {
      console.log("🚀 ~ file: todoService.js ~ line 39 ~ TodoService ~ e", e);
      return e;
    }
  }

  async deleteTodo(todoId) {
    try {
      return await this._axios.delete(`${this._path}/delete/${todoId}`);
    } catch (e) {
      console.log("🚀 ~ file: todoService.js ~ line 47 ~ TodoService ~ e", e);
      return e;
    }
  }
}
