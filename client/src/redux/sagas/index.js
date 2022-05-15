import { all } from "redux-saga/effects";
import { authSaga } from "./authSaga";
import { todoSaga } from "./todoSaga";
import { userSaga } from "./userSaga";
import { chatSaga } from "./chatSaga";

export function* rootSaga() {
  yield all([authSaga(), todoSaga(), userSaga(), chatSaga()]);
}
