import { lazy } from "react";

const LazyHomePage = lazy(() => import("../pages/HomePage"));
const LazyMyProfile = lazy(() => import("../pages/MyProfile"));
const LazyChatPage = lazy(() => import("../pages/ChatPage"));
const LazyTodoPage = lazy(() => import("../pages/TodoPage"));

const LazyLoginPage = lazy(() => import("../pages/LoginPage"));
const LazyRegisterPage = lazy(() => import("../pages/RegisterPage"));

const Lazy404Page = lazy(() => import("../pages/404Page"));

export const routerConfig = [
  {
    name: "HomePage",
    path: "/",
    component: LazyHomePage,
    exact: true,
    isPrivate: true,
  },
  {
    name: "TodoPage",
    path: "/todo",
    component: LazyTodoPage,
    exact: true,
    isPrivate: true,
  },
  {
    name: "MyProfilePage",
    path: "/my-profile",
    component: LazyMyProfile,
    exact: true,
    isPrivate: true,
  },
  {
    name: "ChatPage",
    path: "/chat",
    component: LazyChatPage,
    exact: true,
    isPrivate: true,
  },
  {
    name: "LoginPage",
    path: "/login",
    component: LazyLoginPage,
    exact: false,
    isPrivate: false,
  },
  {
    name: "RegisterPage",
    path: "/register",
    component: LazyRegisterPage,
    exact: false,
    isPrivate: false,
  },
  {
    name: "NotFoundPage",
    path: "*",
    component: Lazy404Page,
    exact: false,
    isPrivate: false,
  },
];
