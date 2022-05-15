import { axiosInstanceClient } from "../config";
import { AuthService } from "./authService";
import { TodoService } from "./todoService";
import { UserService } from "./userService";
import { ChatService } from "./chat.service";
class ServiceClient {
  _authService;
  _userService;
  _todoService;
  _chatService;

  constructor() {
    this._authService = new AuthService(axiosInstanceClient);
    this._userService = new UserService(axiosInstanceClient);
    this._todoService = new TodoService(axiosInstanceClient);
    this._chatService = new ChatService(axiosInstanceClient);
  }
}

export const serviceClient = new ServiceClient();
