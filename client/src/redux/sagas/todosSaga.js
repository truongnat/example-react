import {put, takeLatest} from "@redux-saga/core/effects";
import {TodoService} from "../../services";
import {
  CREATE_TODO,
  ENUM_STATUS,
  genericAction,
  genericType,
  UPDATE_TODO,
  GET_ALL_TODO,
  DELETE_TODO,
} from "../actions";

function* createTodo({payload}) {
  try {
    const response = yield new TodoService().create(payload.data);
    if (response && response.status === 200) {
      yield put(genericAction(CREATE_TODO, ENUM_STATUS.SUCCESS));
      yield put(genericAction(GET_ALL_TODO, ENUM_STATUS.FETCHING, payload.statusType))
    }
  } catch (e) {
    console.log("saga error : ", e);
    yield put(genericAction(CREATE_TODO, ENUM_STATUS.FAILURE, e.message));
  }
}

function* getAllTodo({payload}) {
  try {
    const response = yield new TodoService().getAllTodo(payload);
    if (response && response.status === 200) {
      yield put(
        genericAction(GET_ALL_TODO, ENUM_STATUS.SUCCESS, response.data)
      );
      /*yield put(genericAction(GET_ALL_TODO, ENUM_STATUS.RESET))*/
    }
  } catch (e) {
    console.log("saga error : ", e);
    yield put(genericAction(GET_ALL_TODO, ENUM_STATUS.FAILURE, e.message));
  }
}

function* updateTodo({payload}) {
  try {
    const response = yield new TodoService().updateTodo(payload.data);
    if (response && response.status === 200) {
      yield put(genericAction(UPDATE_TODO, ENUM_STATUS.SUCCESS));
      yield put(genericAction(GET_ALL_TODO, ENUM_STATUS.FETCHING, payload.statusType))
    }
  } catch (e) {
    console.log("saga error : ", e);
    yield put(genericAction(UPDATE_TODO, ENUM_STATUS.FAILURE, e.message));
  }
}

function* deleteTodo({payload}) {
  try {
    const response = yield new TodoService().deleteTodo(payload);
    if (response && response.status === 200) {
      yield put(genericAction(DELETE_TODO, ENUM_STATUS.SUCCESS));
      yield put(genericAction(GET_ALL_TODO,ENUM_STATUS.FETCHING))
    }
  } catch (e) {
    console.log("saga error : ", e);
    yield put(genericAction(DELETE_TODO, ENUM_STATUS.FAILURE, e.message));
  }
}

export function* todosSaga() {
  yield takeLatest(genericType(CREATE_TODO, ENUM_STATUS.FETCHING), createTodo);
  yield takeLatest(genericType(GET_ALL_TODO, ENUM_STATUS.FETCHING), getAllTodo);
  yield takeLatest(genericType(UPDATE_TODO, ENUM_STATUS.FETCHING), updateTodo);
  yield takeLatest(genericType(DELETE_TODO, ENUM_STATUS.FETCHING), deleteTodo);
}
