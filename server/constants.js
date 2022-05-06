const STATUS_TODO = ["initial", "todo", "review", "done", "keeping"];
const DEFAULT_AVATAR = "https://avatars.dicebear.com/api/male/username.svg";
const REGEX_EMAIL =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const ENUM_STATUS_TODO = {
  NONE: "",
  INIT: "initial",
  TODO: "todo",
  REVIEW: "review",
  DONE: "done",
  KEEPING: "keeping",
};

Object.freeze(ENUM_STATUS_TODO);

const MAX_TIME_OTP = 120;
const MIN_LENGTH_PASS = 8;

module.exports = {
  STATUS_TODO,
  DEFAULT_AVATAR,
  REGEX_EMAIL,
  ENUM_STATUS_TODO,
  MAX_TIME_OTP,
  MIN_LENGTH_PASS,
};
