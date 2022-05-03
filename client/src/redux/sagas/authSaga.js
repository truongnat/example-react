import { put, takeLatest } from "@redux-saga/core/effects";
import { StatusCode } from "../../constants";
import { serviceClient } from "../../services";
import { createToast, MemoryClient } from "../../utils";
import {
  CHECKING_AUTH,
  ENUM_STATUS,
  genericAction,
  genericType,
  LOADING_APP,
  LOGIN,
  REGISTER,
  SET_USER,
} from "../actions";

function* login({ payload }) {
  try {
    const result = yield serviceClient._authService.login(payload.data);

    if (
      result?.response?.status === StatusCode.BadRequest ||
      result?.response?.status === StatusCode.NotFound
    ) {
      yield put(
        genericAction(LOGIN, ENUM_STATUS.FAILURE, result.response.data.message)
      );
      MemoryClient.remove("lp");
      MemoryClient.remove("rlp");

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

    const { access_token, refresh_token } = result.data.data;

    MemoryClient.set("lp", access_token);
    MemoryClient.set("rlp", refresh_token);
    yield put(genericAction(CHECKING_AUTH, ENUM_STATUS.PUSH_NORMAL, true));
    yield put(
      genericAction(SET_USER, ENUM_STATUS.PUSH_NORMAL, result.data.data.user)
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
    yield put(genericAction(REGISTER, ENUM_STATUS.SUCCESS));
    createToast(payload.toast, {
      title: "Register successfully, login now!",
      status: "success",
    });

    payload.history.push("/login");
  } catch (e) {
    yield put(genericAction(REGISTER, ENUM_STATUS.FAILURE, e.message));
  }
}

function* checkAuthSaga({ payload }) {
  try {
    yield put(genericAction(LOADING_APP, ENUM_STATUS.PUSH_NORMAL, true));
    const result = yield serviceClient._authService.whoAmI();
    if (result.status === StatusCode.Success) {
      yield put(
        genericAction(SET_USER, ENUM_STATUS.PUSH_NORMAL, result.data.data)
      );
      yield put(genericAction(CHECKING_AUTH, ENUM_STATUS.PUSH_NORMAL, true));
      payload.history.push("/");
    }
    yield put(genericAction(LOADING_APP, ENUM_STATUS.PUSH_NORMAL, false));
  } catch (e) {
    yield put(genericAction(LOADING_APP, ENUM_STATUS.PUSH_NORMAL, false));
  }
}

export function* authSaga() {
  yield takeLatest(genericType(LOGIN, ENUM_STATUS.FETCHING), login);
  yield takeLatest(genericType(REGISTER, ENUM_STATUS.FETCHING), register);
  yield takeLatest(
    genericType(CHECKING_AUTH, ENUM_STATUS.FETCHING),
    checkAuthSaga
  );
}
