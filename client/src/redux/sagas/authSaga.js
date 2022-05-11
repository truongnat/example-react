import { put, takeLatest } from "@redux-saga/core/effects";
import { PAGE_KEYS, StatusCode } from "../../constants";
import { serviceClient } from "../../services";
import { MemoryClient } from "../../utils";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import {
  CHECKING_AUTH,
  ENUM_STATUS,
  FORGOT_PASSWORD,
  genericAction,
  genericType,
  LOADING_APP,
  LOGIN,
  REGISTER,
  SET_USER,
  VERITY_OTP,
} from "../actions";

function* login({ payload }) {
  try {
    const { response, data } = yield serviceClient._authService.login(
      payload.data
    );

    if (
      response?.status === StatusCode.BadRequest ||
      response?.status === StatusCode.NotFound ||
      response?.status === StatusCode.Forbidden
    ) {
      yield put(
        genericAction(LOGIN, ENUM_STATUS.FAILURE, response.data.message)
      );
      MemoryClient.remove("lp");
      MemoryClient.remove("rlp");
      Notify.failure(response?.data?.message, {
        position: "center-top",
      });
      return;
    }

    Notify.success("Login successfully", {
      position: "center-top",
    });

    const { access_token, refresh_token } = data?.data;

    MemoryClient.set("lp", access_token);
    MemoryClient.set("rlp", refresh_token);
    yield put(genericAction(CHECKING_AUTH, ENUM_STATUS.PUSH_NORMAL, true));
    yield put(genericAction(LOGIN, ENUM_STATUS.SUCCESS));
    yield put(
      genericAction(SET_USER, ENUM_STATUS.PUSH_NORMAL, data?.data?.user)
    );
  } catch (e) {
    yield put(genericAction(LOGIN, ENUM_STATUS.FAILURE, e.message));
  }
}

function* register({ payload }) {
  try {
    const dataRegister = {
      user: {
        ...payload.data,
      },
    };
    const { response } = yield serviceClient._authService.register(
      dataRegister
    );

    if (
      response?.status === StatusCode.BadRequest ||
      response?.status === StatusCode.NotFound
    ) {
      yield put(
        genericAction(REGISTER, ENUM_STATUS.FAILURE, response.data.message)
      );

      Notify.failure(response?.data?.message, {
        position: "center-top",
      });

      return;
    }
    yield put(genericAction(REGISTER, ENUM_STATUS.SUCCESS));
    Notify.success("Register successfully, login now!", {
      position: "center-top",
    });

    payload.history.push(PAGE_KEYS.LoginPage);
  } catch (e) {
    yield put(genericAction(REGISTER, ENUM_STATUS.FAILURE, e.message));
  }
}

function* checkAuthSaga({ payload }) {
  try {
    yield put(genericAction(LOADING_APP, ENUM_STATUS.PUSH_NORMAL, true));
    const { data } = yield serviceClient._authService.whoAmI();
    yield put(genericAction(LOADING_APP, ENUM_STATUS.PUSH_NORMAL, false));

    if (data?.status === StatusCode.Success) {
      yield put(genericAction(SET_USER, ENUM_STATUS.PUSH_NORMAL, data.data));
      yield put(genericAction(CHECKING_AUTH, ENUM_STATUS.PUSH_NORMAL, true));
      payload.history.push(PAGE_KEYS.HomePage);
    }
  } catch (e) {
    yield put(genericAction(LOADING_APP, ENUM_STATUS.PUSH_NORMAL, false));
  }
}

function* forgotPassword({ payload }) {
  try {
    const { response, data } = yield serviceClient._authService.forgotPassword(
      payload.data
    );

    if (response?.status === StatusCode.NotFound) {
      Notify.failure(response?.data?.message, {
        position: "center-top",
      });
      yield put(
        genericAction(
          FORGOT_PASSWORD,
          ENUM_STATUS.FAILURE,
          response?.data?.message
        )
      );
      return;
    }

    if (data?.status === StatusCode.Success) {
      Notify.success("Forgot successfully, verify now!", {
        position: "center-top",
      });

      yield put(genericAction(FORGOT_PASSWORD, ENUM_STATUS.SUCCESS));
      payload.history.push({
        pathname: PAGE_KEYS.VerifyOtpPassPage,
        search: `?e=${payload.data.email}`,
      });
    }
  } catch (e) {
    yield put(genericAction(FORGOT_PASSWORD, ENUM_STATUS.FAILURE, e.message));
  }
}

function* verifyOtpForgotPassword({ payload }) {
  try {
    const { response, data } = yield serviceClient._authService.verifyOtpForgot(
      payload.data
    );

    if (
      response?.status === StatusCode.NotFound ||
      response?.status === StatusCode.BadRequest
    ) {
      Notify.failure(response?.data?.message);

      yield put(
        genericAction(VERITY_OTP, ENUM_STATUS.FAILURE, response?.data?.message)
      );
      return;
    }

    if (data?.status === StatusCode.Success) {
      Notify.success(
        "Verify successfully, plz check email receiver new password!",
        {
          position: "center-top",
        }
      );
      yield put(genericAction(VERITY_OTP, ENUM_STATUS.SUCCESS));
      payload.history.push(PAGE_KEYS.LoginPage);
    }
  } catch (e) {
    yield put(genericAction(VERITY_OTP, ENUM_STATUS.FAILURE, e.message));
  }
}

export function* authSaga() {
  yield takeLatest(genericType(LOGIN, ENUM_STATUS.FETCHING), login);
  yield takeLatest(genericType(REGISTER, ENUM_STATUS.FETCHING), register);
  yield takeLatest(
    genericType(CHECKING_AUTH, ENUM_STATUS.FETCHING),
    checkAuthSaga
  );
  yield takeLatest(
    genericType(FORGOT_PASSWORD, ENUM_STATUS.FETCHING),
    forgotPassword
  );
  yield takeLatest(
    genericType(VERITY_OTP, ENUM_STATUS.FETCHING),
    verifyOtpForgotPassword
  );
}
