import { put, takeLatest, all } from "redux-saga/effects";
import {
  CHECKING_AUTH,
  ENUM_STATUS,
  genericAction,
  genericType,
  LOGIN,
} from "./actions";
import { Authenticate } from "../services";
import { MemoryClient } from "../utils";

function* login({ payload }) {
  try {
    const response = yield new Authenticate().login(payload);
    if (response.data && response.data.status === 200) {
      MemoryClient.set("lp", response.data.data.access_token);
      yield put(genericAction(CHECKING_AUTH, ENUM_STATUS.PUSH_NORMAL, true));
      return yield put(
        genericAction(LOGIN, ENUM_STATUS.SUCCESS, response.data.data.user)
      );
    }
    MemoryClient.remove("lp");
    yield put(genericAction(LOGIN, ENUM_STATUS.FAILURE, response.data.message));
  } catch (e) {
    console.log("saga error : ", e);
    yield put(genericAction(LOGIN, ENUM_STATUS.FAILURE, e.message));
  }
}

function* authSaga() {
  yield takeLatest(genericType(LOGIN, ENUM_STATUS.FETCHING), login);
}

export default function* rootSaga() {
  yield all([authSaga()]);
}
