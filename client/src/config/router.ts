import { lazy } from "react";
import { PAGE_KEYS } from "../constants";

const LazyHomePage = lazy(() => import("../pages/HomePage"));
const LazyMyProfile = lazy(() => import("../pages/MyProfile"));
const LazyChatPage = lazy(() => import("../pages/ChatPage"));
const LazyTodoPage = lazy(() => import("../pages/TodoPage"));

const LazyLoginPage = lazy(() => import("../pages/LoginPage"));
const LazyRegisterPage = lazy(() => import("../pages/RegisterPage"));
const LazyForgotPasswordPage = lazy(() =>
  import("../pages/ForgotPasswordPage")
);
const LazyVerifyOtpPassPage = lazy(() =>
  import("../pages/VerifyOtpForgotPassPage")
);

const Lazy404Page = lazy(() => import("../pages/404Page"));
const LazyRoomPage = lazy(() => import("../pages/RoomPage"));

export const routerConfig = [
  {
    name: "HomePage",
    path: PAGE_KEYS.HomePage,
    component: LazyHomePage,
    exact: true,
    isPrivate: true,
  },
  {
    name: "TodoPage",
    path: PAGE_KEYS.TodoPage,
    component: LazyTodoPage,
    exact: true,
    isPrivate: true,
  },
  {
    name: "MyProfilePage",
    path: PAGE_KEYS.ProfilePage,
    component: LazyMyProfile,
    exact: true,
    isPrivate: true,
  },
  {
    name: "ChatPage",
    path: PAGE_KEYS.ChatPage,
    component: LazyChatPage,
    exact: true,
    isPrivate: true,
  },
  {
    name: "RoomPage",
    path: PAGE_KEYS.RoomPage + "/:id",
    component: LazyRoomPage,
    exact: true,
    isPrivate: true,
  },
  {
    name: "LoginPage",
    path: PAGE_KEYS.LoginPage,
    component: LazyLoginPage,
    exact: false,
    isPrivate: false,
  },
  {
    name: "RegisterPage",
    path: PAGE_KEYS.RegisterPage,
    component: LazyRegisterPage,
    exact: false,
    isPrivate: false,
  },
  {
    name: "ForgotPasswordPage",
    path: PAGE_KEYS.ForgotPassword,
    component: LazyForgotPasswordPage,
    exact: false,
    isPrivate: false,
  },
  {
    name: "VerifyOtpPassPage",
    path: PAGE_KEYS.VerifyOtpPassPage,
    component: LazyVerifyOtpPassPage,
    exact: false,
    isPrivate: false,
  },
  {
    name: "NotFoundPage",
    path: PAGE_KEYS.NotFoundPage,
    component: Lazy404Page,
    exact: false,
    isPrivate: false,
  },
];
