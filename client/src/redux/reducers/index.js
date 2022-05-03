import { combineReducers } from "redux";
import { AppReducer } from "./app";
import { AuthReducer } from "./auth";
import { TodoReducer } from "./todo";
import { ChatReducer } from "./chat";

export const rootReducer = combineReducers({
  app: AppReducer,
  auth: AuthReducer,
  todo: TodoReducer,
  chat: ChatReducer,
});
