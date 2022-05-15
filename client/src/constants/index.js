export const STATUS_TODO = ["initial", "todo", "review", "done", "keeping"];

export const ENUM_STATUS_TODO = {
  INIT: "initial",
  TODO: "todo",
  REVIEW: "review",
  DONE: "done",
  KEEPING: "keeping",
};

export const DEFAULT_AVATAR =
  "https://avatars.dicebear.com/api/male/username.svg";

export const StatusCode = {
  NotFound: 404,
  Forbidden: 403,
  BadRequest: 400,
  ManyRequest: 429,
  ServerError: 500,
  UnAuthorized: 401,
  Success: 200,
  Created: 201,
  Error: "error",
  NetworkError: "Network Error",
};

export const PAGE_KEYS = {
  HomePage: "/",
  TodoPage: "/todo",
  ChatPage: "/chatting",
  ProfilePage: "/my-profile",
  RoomPage: "/chatting/room",

  LoginPage: "/login",
  RegisterPage: "/register",
  ForgotPassword: "/forgot-password",
  VerifyOtpPassPage: "/verify-otp",

  NotFoundPage: "*",
};

export const LIST_PAGE_PROTECTED = [
  PAGE_KEYS.HomePage,
  PAGE_KEYS.TodoPage,
  PAGE_KEYS.ChatPage,
  PAGE_KEYS.ProfilePage,
];

export const REGEX_EMAIL =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
