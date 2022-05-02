const AppServer = require("./appServer");
const {
  AuthController,
  TodoController,
  UserController,
} = require("./controllers");

const app = new AppServer([
  new AuthController(),
  new UserController(),
  new TodoController(),
]);

app.startListening();
