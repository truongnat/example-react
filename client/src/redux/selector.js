
export const userSelector = (state) => state.auth;
export const todoCreateSelector = (state) => state.todo.todoCreate;
export const todoUpdateSelector = (state) => state.todo.todoUpdate;
export const todoDeleteSelector = (state) => state.todo.todoDelete;

//================== MAIN FEATURE ==================//
export const authenticatedSelector = (state) => state.app.isAuthenticated;
export const todoListSelector = (state) => state.todo.todoList;
export const todoSelector = (state) => state.todo;
//================== LOADING ==================//
export const selectorLoadingApp = (state) => state.app.loading;
export const authLoadingSelector = (state) => state.auth.loading;
export const todoLoadingSelector = (state) => state.todo.loading;

//================== ERROR MESSAGE ==================//
export const errorAuthSelector = (state) => state.auth.messageError;
