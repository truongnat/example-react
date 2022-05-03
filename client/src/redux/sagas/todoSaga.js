import { put, takeLatest } from "@redux-saga/core/effects";
import { StatusCode } from "../../constants";
import { createFactoryApp } from "../../factory";
import { serviceClient } from "../../services";
import { createToast } from "../../utils";
import {
  CREATE_TODO,
  ENUM_STATUS,
  genericAction,
  genericType,
  UPDATE_TODO,
  GET_ALL_TODO,
  DELETE_TODO,
} from "../actions";

function* createTodo({ payload }) {
  try {
    const result = yield serviceClient._todoService.createTodo(payload.data);

    if (result?.response?.status === StatusCode.BadRequest) {
      yield put(
        genericAction(
          CREATE_TODO,
          ENUM_STATUS.FAILURE,
          result.response.data.message
        )
      );

      createToast(payload.toast, {
        title: "Create todo failure",
        description: result.response.data.message,
        status: "error",
      });
      return;
    }

    payload.reset({
      title: "",
      content: "",
    });

    createToast(payload.toast, {
      title: "Create todo successfully",
      status: "success",
    });
    yield put(
      genericAction(GET_ALL_TODO, ENUM_STATUS.FETCHING, {
        status: payload.statusType,
      })
    );
  } catch (e) {
    console.log("🚀 ~ file: todoSaga.js ~ line 29 ~ e", e);
    yield put(genericAction(CREATE_TODO, ENUM_STATUS.FAILURE, e.message));
  }
}

function* getAllTodo({ payload }) {
  try {
    const result = yield serviceClient._todoService.getAllTodo(payload?.status);

    if (result?.data?.data?.todoList) {
      const mappedData = result.data.data.todoList.map((todo) =>
        createFactoryApp("Todo", todo)
      );
      yield put(genericAction(GET_ALL_TODO, ENUM_STATUS.SUCCESS, mappedData));
    }
  } catch (e) {
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

      createToast(payload.toast, {
        title: "Update todo failure",
        description: result.response.data.message,
        status: "error",
      });
      return;
    }

    createToast(payload.toast, {
      title: "Update todo successfully",
      status: "success",
    });
    payload.onClose();

    yield put(
      genericAction(GET_ALL_TODO, ENUM_STATUS.FETCHING, {
        status: payload.statusType,
      })
    );
  } catch (e) {
    console.log("🚀 ~ file: todoSaga.js ~ line 98 ~ e", e);
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

      createToast(payload.toast, {
        title: "Delete todo failure",
        description: result.response.data.message,
        status: "error",
      });
      return;
    }

    createToast(payload.toast, {
      title: "Delete todo successfully",
      status: "success",
    });

    payload.onClose();

    yield put(
      genericAction(GET_ALL_TODO, ENUM_STATUS.FETCHING, {
        status: payload.statusType,
      })
    );
  } catch (e) {
    console.log("🚀 ~ file: todoSaga.js ~ line 131 ~ e", e);
    yield put(genericAction(DELETE_TODO, ENUM_STATUS.FAILURE, e.message));
  }
}

export function* todoSaga() {
  yield takeLatest(genericType(GET_ALL_TODO, ENUM_STATUS.FETCHING), getAllTodo);
  yield takeLatest(genericType(CREATE_TODO, ENUM_STATUS.FETCHING), createTodo);
  yield takeLatest(genericType(UPDATE_TODO, ENUM_STATUS.FETCHING), updateTodo);
  yield takeLatest(genericType(DELETE_TODO, ENUM_STATUS.FETCHING), deleteTodo);
}
