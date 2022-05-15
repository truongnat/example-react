import {
  ENUM_STATUS,
  genericType,
  GET_ALL_ROOM,
  ROOM_DETAIL,
} from "../actions";

const initReducer = {
  rooms: [],
  roomDetail: {},
  loading: false,
};

export const ChatReducer = (state = initReducer, { type, payload }) => {
  switch (type) {
    case genericType(GET_ALL_ROOM, ENUM_STATUS.FETCHING):
    case genericType(ROOM_DETAIL, ENUM_STATUS.FETCHING):
      return {
        ...state,
        loading: true,
      };
    case genericType(GET_ALL_ROOM, ENUM_STATUS.SUCCESS):
      return {
        ...state,
        loading: false,
        rooms: payload,
      };

    case genericType(ROOM_DETAIL, ENUM_STATUS.SUCCESS):
      return {
        ...state,
        loading: false,
        roomDetail: payload,
      };

    default:
      return Object.assign({}, state);
  }
};
