// authentication
export const LOGIN = "LOGIN";
export const REGISTER = "REGISTER";
export const CHECKING_AUTH = "CHECKING_AUTH";
export const LOADING_APP = "LOADING_APP";
export const FORGOT_PASSWORD = "FORGOT_PASSWORD";
export const VERITY_OTP = "VERITY_OTP";

// todo list
export const CREATE_TODO = "CREATE_TODO";
export const UPDATE_TODO = "UPDATE_TODO";
export const DELETE_TODO = "DELETE_TODO";
export const GET_ALL_TODO = "GET_ALL_TODO";

// user

export const SET_USER = "SET_USER";
export const UPDATE_USER = "UPDATE_USER";

// chat socket
export const GET_ALL_ROOM = "GET_ALL_ROOM";
export const GET_ROOM_DETAIL = "GET_ROOM_DETAIL";
export const DELETE_ROOM = "DELETE_ROOM";
export const UPDATE_ROOM_INFO = "UPDATE_ROOM_INFO";

export const GET_ALL_MESSAGE_BY_ROOM_ID = "GET_ALL_MESSAGE_BY_ROOM_ID";
export const SEND_MESSAGE = "SEND_MESSAGE";
export const DELETE_MESSAGE = "DELETE_MESSAGE";
export const UPDATE_MESSAGE = "UPDATE_MESSAGE";

export const KICK_PARTICIPANT = "KICK_PARTICIPANT";
export const CHANGE_ROLE_HOST_ROOM = "CHANGE_ROLE_HOST_ROOM";

// common
export const ENUM_STATUS = {
  FETCHING: "FETCHING",
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
  KEEPING: "KEEPING",
  CANCELLED: "CANCELLED",
  PUSH_NORMAL: "PUSH_NORMAL",
  RESET: "RESET",
};

export const genericType = (type, status) => {
  return `@@_EXAMPLE_APP_${type}_${status}`;
};

export const genericAction = (type, status, payload) => ({
  type: genericType(type, status),
  payload,
});
