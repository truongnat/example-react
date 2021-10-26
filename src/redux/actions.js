export const LOGIN = "LOGIN";
export const CHECKING_AUTH = "CHECKING_AUTH";
export const LOADING_APP = "LOADING_APP";
export const INIT_TODO = "INIT_TODO";
export const CREATE_TODO = "CREATE_TODO";
export const UPDATE_TODO = "UPDATE_TODO";
export const REMOVE_TODO = "REMOVE_TODO";
export const GET_ALL_TODO = "GET_ALL_TODO";
export const FILTER_TODO_ALL = "FILTER_TODO_ALL";
export const FILTER_TODO_COMPLETED = "FILTER_TODO_COMPLETED";
export const FILTER_TODO_WORK = "FILTER_TODO_WORK";
export const FILTER_TODO_SKIPPED = "FILTER_TODO_SKIPPED";
export const ENUM_STATUS = {
  FETCHING: "FETCHING",
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
  KEEPING: "KEEPING",
  CANCELLED: "CANCELLED",
  PUSH_NORMAL: "PUSH_NORMAL",
};

export const genericType = (type, status) => {
  return `@@_EXAMPLE_APP_${type}_${status}`;
};

export const genericAction = (type, status, payload) => ({
  type: genericType(type, status),
  payload,
});
