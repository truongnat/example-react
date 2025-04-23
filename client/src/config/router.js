"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerConfig = void 0;
const react_1 = require("react");
const constants_1 = require("../constants");
const LazyHomePage = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require("../pages/HomePage"))));
const LazyMyProfile = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require("../pages/MyProfile"))));
const LazyChatPage = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require("../pages/ChatPage"))));
const LazyTodoPage = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require("../pages/TodoPage"))));
const LazyLoginPage = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require("../pages/LoginPage"))));
const LazyRegisterPage = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require("../pages/RegisterPage"))));
const LazyForgotPasswordPage = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require("../pages/ForgotPasswordPage"))));
const LazyVerifyOtpPassPage = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require("../pages/VerifyOtpForgotPassPage"))));
const Lazy404Page = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require("../pages/404Page"))));
const LazyRoomPage = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require("../pages/RoomPage"))));
exports.routerConfig = [
    {
        name: "HomePage",
        path: constants_1.PAGE_KEYS.HomePage,
        component: LazyHomePage,
        exact: true,
        isPrivate: true,
    },
    {
        name: "TodoPage",
        path: constants_1.PAGE_KEYS.TodoPage,
        component: LazyTodoPage,
        exact: true,
        isPrivate: true,
    },
    {
        name: "MyProfilePage",
        path: constants_1.PAGE_KEYS.ProfilePage,
        component: LazyMyProfile,
        exact: true,
        isPrivate: true,
    },
    {
        name: "ChatPage",
        path: constants_1.PAGE_KEYS.ChatPage,
        component: LazyChatPage,
        exact: true,
        isPrivate: true,
    },
    {
        name: "RoomPage",
        path: constants_1.PAGE_KEYS.RoomPage + "/:id",
        component: LazyRoomPage,
        exact: true,
        isPrivate: true,
    },
    {
        name: "LoginPage",
        path: constants_1.PAGE_KEYS.LoginPage,
        component: LazyLoginPage,
        exact: false,
        isPrivate: false,
    },
    {
        name: "RegisterPage",
        path: constants_1.PAGE_KEYS.RegisterPage,
        component: LazyRegisterPage,
        exact: false,
        isPrivate: false,
    },
    {
        name: "ForgotPasswordPage",
        path: constants_1.PAGE_KEYS.ForgotPassword,
        component: LazyForgotPasswordPage,
        exact: false,
        isPrivate: false,
    },
    {
        name: "VerifyOtpPassPage",
        path: constants_1.PAGE_KEYS.VerifyOtpPassPage,
        component: LazyVerifyOtpPassPage,
        exact: false,
        isPrivate: false,
    },
    {
        name: "NotFoundPage",
        path: constants_1.PAGE_KEYS.NotFoundPage,
        component: Lazy404Page,
        exact: false,
        isPrivate: false,
    },
];
