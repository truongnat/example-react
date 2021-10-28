export const selectorAuth = (state) => state.app.isAuthenticated;
export const selectorLoadingApp = (state) => state.app.loading;
export const todosSelector = (state) => state.todos;
export const todoCreateSelector = (state) => state.todos.todoCreate;
export const todoUpdateSelector = (state) => state.todos.todoUpdate;
export const todoDeleteSelector = (state) => state.todos.todoDelete;
export const userSelector = (state) => state.auth;
