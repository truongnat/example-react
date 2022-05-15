const AppServer = require("./appServer");
const {
  AuthController,
  TodoController,
  UserController,
  ChatController,
} = require("./controllers");

const app = new AppServer([
  new AuthController(),
  new UserController(),
  new TodoController(),
  new ChatController(),
]);

app.startListening();
