"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.axiosInstanceClient = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const notiflix_notify_aio_1 = require("notiflix/build/notiflix-notify-aio");
// const baseURLMock = "https://jsonplaceholder.typicode.com/";
const baseURL = "http://localhost:5000";
/**
 * @Api Custom class base axios auto inject token header on session storage.
 * @support fetch - post - put - patch - delete.
 * */
class AxiosInstance {
    constructor() {
        this._axiosInstance = axios_1.default.create({
            baseURL: import.meta.env.NODE_ENV === "production"
                ? import.meta.env.VITE_BASE_URL
                : baseURL,
            timeout: 100000,
        });
        this._axiosInstance.interceptors.request.use((config) => {
            config.headers = Object.assign(Object.assign({}, config.headers), this.getHeader());
            return config;
        }, (error) => {
            return Promise.reject(error);
        });
        this._axiosInstance.interceptors.response.use((response) => {
            return response;
        }, (err) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const errCode = (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.status;
            const originalConfig = err.config;
            if (errCode === constants_1.StatusCode.UnAuthorized &&
                this.getToken() &&
                this.getRefreshToken() &&
                !originalConfig._retry) {
                originalConfig._retry = true;
                return yield this.handleRefreshToken(originalConfig);
            }
            else if (errCode === constants_1.StatusCode.ManyRequest) {
                notiflix_notify_aio_1.Notify.failure("Many requests, try again after some minutes!");
            }
            else if (errCode === constants_1.StatusCode.ServerError) {
                notiflix_notify_aio_1.Notify.failure("Something went wrong, try again after some minutes!");
            }
            else if (errCode === constants_1.StatusCode.NetworkError) {
                notiflix_notify_aio_1.Notify.failure("Connection network error, Please check network!");
            }
            return Promise.reject(err);
        }));
    }
    /**
     * @fetch method auto inject header token.
     * @param url - { String }.
     * @response Promise axios get method.
     * */
    fetch(url) {
        return this._axiosInstance.get(url);
    }
    /**
     * @post method auto inject header token.
     * @param url - { String }, payload - { String }.
     * @response Promise axios post method.
     * */
    post(url, payload) {
        return this._axiosInstance.post(url, payload);
    }
    /**
     * @put method auto inject header token.
     * @param url - { String }, payload - { String }.
     * @response Promise axios put method.
     * */
    put(url, payload) {
        return this._axiosInstance.put(url, payload);
    }
    /**
     * @patch method auto inject header token.
     * @param url - { String }, payload - { String }.
     * @response Promise axios patch method.
     * */
    patch(url, payload) {
        return this._axiosInstance.patch(url, payload);
    }
    /**
     * @delete method auto inject header token.
     * @param url - { String }, payload - { String }.
     * @response Promise axios delete method.
     * */
    delete(url, payload) {
        return this._axiosInstance.delete(url, payload);
    }
    /**
     * @get token header from session storage.
     * @return Header axios object.
     * */
    getHeader() {
        return {
            "Content-Type": "application/json",
            "x-access-token": this.getToken(),
        };
    }
    getToken() {
        return utils_1.MemoryClient.get("lp") || "";
    }
    getRefreshToken() {
        return utils_1.MemoryClient.get("rlp") || "";
    }
    handleRefreshToken(originalConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rs = yield this._axiosInstance.post("/auth/refresh-token", {
                    oldToken: this.getRefreshToken(),
                });
                const { access_token, refresh_token } = rs.data.data;
                utils_1.MemoryClient.set("lp", access_token);
                utils_1.MemoryClient.set("rlp", refresh_token);
                return this._axiosInstance(originalConfig);
            }
            catch (_error) {
                return Promise.reject(_error);
            }
        });
    }
}
exports.axiosInstanceClient = new AxiosInstance();
