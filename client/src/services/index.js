import { axiosInstanceClient } from "../config";
import { AuthService } from "./authService";
import { TodoService } from "./todoService";
import { UserService } from "./userService";

class ServiceClient {
  _authService;
  _userService;
  _todoService;

  constructor() {
    this._authService = new AuthService(axiosInstanceClient);
    this._userService = new UserService(axiosInstanceClient);
    this._todoService = new TodoService(axiosInstanceClient);
  }
}

export const serviceClient = new ServiceClient();
