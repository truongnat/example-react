const TodoController = require("./controllers/todo.controllers");
const UserController = require("./controllers/user.controller");
const AuthController = require("./controllers/auth.controller");
const AppServer = require("./appServer");

const app = new AppServer([
  new TodoController(),
  new UserController(),
  new AuthController(),
]);

app.startListening();
