import { put, takeLatest } from "@redux-saga/core/effects";
import { Authenticate } from "../../services";
import { MemoryClient } from "../../utils";
import {
  CHECKING_AUTH,
  ENUM_STATUS,
  genericAction,
  genericType,
  GET_ALL_TODO,
  LOGIN,
} from "../actions";

function* login({ payload }) {
  try {
    const response = yield new Authenticate().login(payload);
    if (response.data && response.data.status === 200) {
      MemoryClient.set("lp", response.data.data.access_token);
      yield put(genericAction(CHECKING_AUTH, ENUM_STATUS.PUSH_NORMAL, true));
      yield put(genericAction(GET_ALL_TODO, ENUM_STATUS.FETCHING));
      yield new Authenticate().checkingMe();
      return yield put(
        genericAction(LOGIN, ENUM_STATUS.SUCCESS, response.data.data.user)
      );
    } else {
      MemoryClient.remove("lp");
      yield put(genericAction(LOGIN, ENUM_STATUS.FAILURE, response.data));
    }
  } catch (e) {
    yield put(genericAction(LOGIN, ENUM_STATUS.FAILURE, e.message));
  }
}

export function* authSaga() {
  yield takeLatest(genericType(LOGIN, ENUM_STATUS.FETCHING), login);
}
