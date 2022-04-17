const TodosController = require('./controllers/todos.controllers');
const UserController = require('./controllers/user.controller');
const AppServer = require('./appServer');

const app = new AppServer([new TodosController(), new UserController()]);

app.startListening();
