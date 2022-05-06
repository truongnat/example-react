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
  try {
    const { response } = yield serviceClient._userService.updateUser({
      ...payload.data,
    });

    if (
      response?.status === StatusCode.BadRequest ||
      response?.status === StatusCode.NotFound
    ) {
      yield put(
        genericAction(UPDATE_USER, ENUM_STATUS.FAILURE, response.data.message)
      );

      createToast(payload.toast, {
        title: "Update user failure",
        description: response.data.message,
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
