import { combineReducers } from "redux";
import { AppReducer } from "./app";
import { AuthReducer } from "./auth";
import { TodosReducer } from "./todos";
import { ChatReducer } from "./chat";

export const rootReducer = combineReducers({
  app: AppReducer,
  auth: AuthReducer,
  todos: TodosReducer,
  chat: ChatReducer,
});
