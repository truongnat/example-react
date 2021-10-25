export const LOGIN = "LOGIN";
export const USER = "USER";
export const POSTS = "POSTS";
export const CHECKING_AUTH = "CHECKING_AUTH";
export const LOADING_APP = "LOADING_APP";
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
