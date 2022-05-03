import { all } from "redux-saga/effects";
import { authSaga } from "./authSaga";
import { todoSaga } from "./todoSaga";

export function* rootSaga() {
  yield all([authSaga(), todoSaga()]);
}
