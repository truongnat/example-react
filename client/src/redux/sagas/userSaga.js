import { put, takeLatest } from "@redux-saga/core/effects";
import { StatusCode } from "../../constants";
import { serviceClient } from "../../services";
import { createToast } from "../../utils";
import {
  ENUM_STATUS,
  genericAction,
  genericType,
  UPDATE_USER,
} from "../actions";

function* updateUser({ payload }) {
  const data = {
    username: payload.data.username,
    password: payload.data.password,
    avatarUrl: payload.data.avatarUrl,
  };
  try {
    const result = yield serviceClient._userService.updateUser(data);

    if (
      result?.response?.status === StatusCode.BadRequest ||
      result?.response?.status === StatusCode.NotFound
    ) {
      yield put(
        genericAction(
          UPDATE_USER,
          ENUM_STATUS.FAILURE,
          result.response.data.message
        )
      );

      createToast(payload.toast, {
        title: "Update user failure",
        description: result.response.data.message,
        status: "error",
      });

      return;
    }

    createToast(payload.toast, {
      title: "Update user successfully",
      status: "success",
    });
  } catch (e) {
    yield put(genericAction(UPDATE_USER, ENUM_STATUS.FAILURE, e.message));
  }
}

export function* userSaga() {
  yield takeLatest(genericType(UPDATE_USER, ENUM_STATUS.FETCHING), updateUser);
}
