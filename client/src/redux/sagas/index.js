import { all } from "redux-saga/effects";
import { authSaga } from "./authSaga";
import { todosSaga } from "./todosSaga";

export function* rootSaga() {
  yield all([authSaga(), todosSaga()]);
}
