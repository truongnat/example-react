import { put, takeLatest } from "@redux-saga/core/effects";
import { StatusCode } from "../../constants";
import { serviceClient } from "../../services";
import {
  ENUM_STATUS,
  genericAction,
  genericType,
  UPDATE_USER,
} from "../actions";
import { Notify } from "notiflix/build/notiflix-notify-aio";

function* updateUser({ payload }) {
  try {
    const { response, data } = yield serviceClient._userService.updateUser({
      ...payload.data,
    });

    if (
      response?.status === StatusCode.BadRequest ||
      response?.status === StatusCode.NotFound
    ) {
      yield put(
        genericAction(UPDATE_USER, ENUM_STATUS.FAILURE, response.data.message)
      );
      Notify.failure("Update user failure", {
        position: "center-top",
      });
      return;
    }

    if (data?.status === StatusCode.Success) {
      Notify.success("Update user successfully", {
        position: "center-top",
      });
      payload.reset({
        currentPassword: "",
        newPassword: "",
        reNewPassword: "",
      });
      yield put(genericAction(UPDATE_USER, ENUM_STATUS.SUCCESS));
    }
  } catch (e) {
    Notify.failure(e.message, {
      position: "center-top",
    });
    yield put(genericAction(UPDATE_USER, ENUM_STATUS.FAILURE, e.message));
  }
}

export function* userSaga() {
  yield takeLatest(genericType(UPDATE_USER, ENUM_STATUS.FETCHING), updateUser);
}
