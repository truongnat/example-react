import { put, takeLatest } from "@redux-saga/core/effects";
import { ENUM_STATUS_TODO, StatusCode } from "../../constants";
import { serviceClient } from "../../services";
import { createToast, MemoryClient } from "../../utils";
import {
  CHECKING_AUTH,
  ENUM_STATUS,
  genericAction,
  genericType,
  GET_ALL_TODO,
  LOGIN,
  REGISTER,
} from "../actions";

function* login({ payload }) {
  try {
    const result = yield serviceClient._authService.login(payload.data);
    console.log(
      "🚀 ~ file: authSaga.js ~ line 17 ~ function*login ~ result",
      result
    );

    if (
      result?.response?.status === StatusCode.BadRequest ||
      result?.response?.status === StatusCode.NotFound
    ) {
      yield put(
        genericAction(LOGIN, ENUM_STATUS.FAILURE, result.response.data.message)
      );
      MemoryClient.remove("lp");

      createToast(payload.toast, {
        title: "Login failure",
        description: result.response.data.message,
        status: "error",
      });

      return;
    }

    createToast(payload.toast, {
      title: "Login successfully",
      status: "success",
    });

    MemoryClient.set("lp", result.data.data.access_token);
    yield put(genericAction(CHECKING_AUTH, ENUM_STATUS.PUSH_NORMAL, true));
    yield put(genericAction(LOGIN, ENUM_STATUS.SUCCESS, result.data.data.user));
    yield put(
      genericAction(GET_ALL_TODO, ENUM_STATUS.FETCHING, {
        status: ENUM_STATUS_TODO.INIT,
      })
    );
  } catch (e) {
    yield put(genericAction(LOGIN, ENUM_STATUS.FAILURE, e.message));
  }
}

function* register({ payload }) {
  try {
    const dataRegister = {
      user: {
        username: payload.data.username,
        password: payload.data.password,
      },
    };
    const result = yield serviceClient._authService.register(dataRegister);
    console.log(
      "🚀 ~ file: authSaga.js ~ line 17 ~ function*login ~ result",
      result
    );

    if (
      result?.response?.status === StatusCode.BadRequest ||
      result?.response?.status === StatusCode.NotFound
    ) {
      yield put(
        genericAction(
          REGISTER,
          ENUM_STATUS.FAILURE,
          result.response.data.message
        )
      );

      createToast(payload.toast, {
        title: "Register failure",
        description: result.response.data.message,
        status: "error",
      });

      return;
    }

    createToast(payload.toast, {
      title: "Register successfully, login now!",
      status: "success",
    });

    payload.history.push("/login");
  } catch (e) {
    yield put(genericAction(REGISTER, ENUM_STATUS.FAILURE, e.message));
  }
}

export function* authSaga() {
  yield takeLatest(genericType(LOGIN, ENUM_STATUS.FETCHING), login);
  yield takeLatest(genericType(REGISTER, ENUM_STATUS.FETCHING), register);
}
