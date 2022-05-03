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
  ServerError: 500,
  UnAuthorized: 401,
  Success: 200,
  Created: 201,
  Error: "error",
};

export const PAGE_KEYS = {
  HomePage: "/",
  TodoPage: '/todo',
  ChatPage: "/chat",
  ProfilePage: "/my-profile",
  LoginPage: "/login",
  RegisterPage: "/register",
  NotFoundPage: "*",
};
