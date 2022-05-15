import { put, takeLatest } from "@redux-saga/core/effects";
import { StatusCode } from "../../constants";
import { serviceClient } from "../../services";
import {
  CREATE_ROOM,
  ENUM_STATUS,
  genericAction,
  genericType,
  GET_ALL_ROOM,
  ROOM_DETAIL,
} from "../actions";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { createFactoryApp } from "../../factory";
function* getAllRoom() {
  try {
    const { data } = yield serviceClient._chatService.getRooms();

    if (data?.status === StatusCode.Success) {
      const mappedData = data.data.map((room) =>
        createFactoryApp("Room", room)
      );
      yield put(genericAction(GET_ALL_ROOM, ENUM_STATUS.SUCCESS, mappedData));
    }
  } catch (e) {
    Notify.failure(e.message, {
      position: "center-top",
    });
  }
}

function* createRoom({ payload }) {
  try {
    yield serviceClient._chatService.createRoom(payload.data);
    Notify.success("Create room success", {
      position: "center-top",
    });
    payload.onClose();
    yield put(genericAction(GET_ALL_ROOM, ENUM_STATUS.FETCHING));
  } catch (e) {
    Notify.failure(e.message, {
      position: "center-top",
    });
  }
}

function* roomDetail({ payload }) {
  try {
    const { data, response } = yield serviceClient._chatService.getRoomDetail(
      payload.data
    );

    if (response?.status === StatusCode.NotFound) {
      Notify.failure("Room not found", {
        position: "center-top",
      });
      payload.history.goBack();
      return;
    }
    yield put(genericAction(ROOM_DETAIL, ENUM_STATUS.SUCCESS, data.data));
  } catch (e) {
    Notify.failure(e.message, {
      position: "center-top",
    });
  }
}

export function* chatSaga() {
  yield takeLatest(genericType(GET_ALL_ROOM, ENUM_STATUS.FETCHING), getAllRoom);
  yield takeLatest(genericType(ROOM_DETAIL, ENUM_STATUS.FETCHING), roomDetail);
  yield takeLatest(genericType(CREATE_ROOM, ENUM_STATUS.FETCHING), createRoom);
}
