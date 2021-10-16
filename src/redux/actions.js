export const LOGIN = "LOGIN";

export const USER = "USER";
export const POSTS = "POSTS";

export const ENUM_STATUS = {
  FETCHING: "FETCHING",
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
  KEEPING: "KEEPING",
  CANCELLED: "CANCELLED",
};

export const genericType = (type, status) => {
  return `@@${type}_${status}`;
};

export const genericAction = (type, status, payload) => ({
  type: genericType(type, status),
  payload,
});
