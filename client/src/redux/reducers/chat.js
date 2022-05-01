import {
  ENUM_STATUS,
  genericType,
  GET_ALL_MESSAGE_BY_ROOM_ID,
  GET_ALL_ROOM,
  GET_ROOM_DETAIL,
  SEND_MESSAGE,
  UPDATE_MESSAGE,
  UPDATE_ROOM_INFO,
} from "../actions";

const initReducer = {
  messages: [],
  rooms: [],
  roomDetail: null,
};

export const ChatReducer = (state = initReducer, { type, payload }) => {
  switch (type) {
    case genericType(GET_ALL_ROOM, ENUM_STATUS.SUCCESS):
      return {
        ...state,
        rooms: payload,
      };
    case genericType(GET_ROOM_DETAIL, ENUM_STATUS.SUCCESS):
    case genericType(UPDATE_ROOM_INFO, ENUM_STATUS.SUCCESS):
      return {
        ...state,
        roomDetail: payload,
      };

    case genericType(GET_ALL_MESSAGE_BY_ROOM_ID, ENUM_STATUS.SUCCESS):
      return {
        ...state,
        messages: payload,
      };
    case genericType(SEND_MESSAGE, ENUM_STATUS.SUCCESS):
      return {
        ...state,
        messages: [...state.messages, payload],
      };
    case genericType(UPDATE_MESSAGE, ENUM_STATUS.SUCCESS):
      return {
        ...state,
        messages: state.messages.map((el) => {
          if (el.id === payload.id) {
            return { ...el, ...payload };
          }
          return el;
        }),
      };
    default:
      return Object.assign({}, state);
  }
};
