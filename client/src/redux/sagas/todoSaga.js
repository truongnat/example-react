import { put, takeLatest } from "@redux-saga/core/effects";
import { StatusCode } from "../../constants";
import { createFactoryApp } from "../../factory";
import { serviceClient } from "../../services";
import {
  CREATE_TODO,
  ENUM_STATUS,
  genericAction,
  genericType,
  UPDATE_TODO,
  GET_ALL_TODO,
  DELETE_TODO,
} from "../actions";
import { Notify } from "notiflix/build/notiflix-notify-aio";

function* createTodo({ payload }) {
  try {
    const { response, data } = yield serviceClient._todoService.createTodo(
      payload.data
    );

    if (response?.status === StatusCode.BadRequest) {
      yield put(
        genericAction(CREATE_TODO, ENUM_STATUS.FAILURE, response?.data?.message)
      );

      Notify.failure("Create todo failure !", {
        position: "center-top",
      });

      return;
    }

    payload.reset({
      title: "",
      content: "",
    });

    Notify.success("Create todo successfully !", {
      position: "center-top",
    });
    yield put(
      genericAction(GET_ALL_TODO, ENUM_STATUS.FETCHING, {
        status: payload.statusType,
      })
    );
  } catch (e) {
    Notify.failure(e.message, {
      position: "center-top",
    });
    yield put(genericAction(CREATE_TODO, ENUM_STATUS.FAILURE, e.message));
  }
}

function* getAllTodo({ payload }) {
  try {
    const { data } = yield serviceClient._todoService.getAllTodo(
      payload?.status
    );

    if (data?.data?.todoList) {
      const mappedData = data.data.todoList.map((todo) =>
        createFactoryApp("Todo", todo)
      );
      yield put(genericAction(GET_ALL_TODO, ENUM_STATUS.SUCCESS, mappedData));
    }
  } catch (e) {
    Notify.failure(e.message, {
      position: "center-top",
    });
    yield put(genericAction(GET_ALL_TODO, ENUM_STATUS.FAILURE, e.message));
  }
}

function* updateTodo({ payload }) {
  try {
    const result = yield serviceClient._todoService.updateTodo(payload.data);
    if (result?.response?.status === StatusCode.BadRequest) {
      yield put(
        genericAction(
          UPDATE_TODO,
          ENUM_STATUS.FAILURE,
          result.response.data.message
        )
      );

      Notify.failure("Update todo failure", {
        position: "center-top",
      });

      return;
    }

    Notify.success("Update todo successfully", {
      position: "center-top",
    });

    payload.onClose();

    yield put(
      genericAction(GET_ALL_TODO, ENUM_STATUS.FETCHING, {
        status: payload.statusType,
      })
    );
  } catch (e) {
    Notify.failure(e.message, {
      position: "center-top",
    });
    yield put(genericAction(UPDATE_TODO, ENUM_STATUS.FAILURE, e.message));
  }
}

function* deleteTodo({ payload }) {
  try {
    const result = yield serviceClient._todoService.deleteTodo(
      payload.todo._id
    );
    if (result?.response?.status === StatusCode.BadRequest) {
      yield put(
        genericAction(
          DELETE_TODO,
          ENUM_STATUS.FAILURE,
          result.response.data.message
        )
      );

      Notify.failure("Delete todo failure", {
        position: "center-top",
      });

      return;
    }

    Notify.success("Delete todo successfully", {
      position: "center-top",
    });

    payload.onClose();

    yield put(
      genericAction(GET_ALL_TODO, ENUM_STATUS.FETCHING, {
        status: payload.statusType,
      })
    );
  } catch (e) {
    Notify.failure(e.message, {
      position: "center-top",
    });

    yield put(genericAction(DELETE_TODO, ENUM_STATUS.FAILURE, e.message));
  }
}

export function* todoSaga() {
  yield takeLatest(genericType(GET_ALL_TODO, ENUM_STATUS.FETCHING), getAllTodo);
  yield takeLatest(genericType(CREATE_TODO, ENUM_STATUS.FETCHING), createTodo);
  yield takeLatest(genericType(UPDATE_TODO, ENUM_STATUS.FETCHING), updateTodo);
  yield takeLatest(genericType(DELETE_TODO, ENUM_STATUS.FETCHING), deleteTodo);
}
