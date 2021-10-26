import { combineReducers } from "redux";
import { AppReducer } from "./app";
import { AuthReducer } from "./auth";
import { TodosReducer } from "./todos";

export const rootReducer = combineReducers({
  app: AppReducer,
  auth: AuthReducer,
  todos: TodosReducer,
});
