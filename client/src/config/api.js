import axios from "axios";
import { StatusCode } from "../constants";
import { MemoryClient } from "../utils";
import { Notify } from "notiflix/build/notiflix-notify-aio";

// const baseURLMock = "https://jsonplaceholder.typicode.com/";
const baseURL = "http://localhost:5000";
/**
 * @Api Custom class base axios auto inject token header on session storage.
 * @support fetch - post - put - patch - delete.
 * */
class AxiosInstance {
  _axiosInstance;

  constructor() {
    this._axiosInstance = axios.create({
      baseURL:
        process.env.NODE_ENV === "production"
          ? process.env.REACT_APP_BASE_URL
          : baseURL,
      timeout: 100000,
    });

    this._axiosInstance.interceptors.request.use(
      (config) => {
        config.headers = {
          ...config.headers,
          ...this.getHeader(),
        };
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this._axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (err) => {
        const errCode = err?.response?.status;
        const originalConfig = err.config;

        if (
          errCode === StatusCode.UnAuthorized &&
          this.getToken() &&
          this.getRefreshToken() &&
          !originalConfig._retry
        ) {
          originalConfig._retry = true;
          return await this.handleRefreshToken(originalConfig);
        } else if (errCode === StatusCode.ManyRequest) {
          Notify.failure("Many requests, try again after some minutes!");
        } else if (errCode === StatusCode.ServerError) {
          Notify.failure("Something went wrong, try again after some minutes!");
        } else if (errCode === StatusCode.NetworkError) {
          Notify.failure("Connection network error, Please check network!");
        }
        return Promise.reject(err);
      }
    );
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
    return MemoryClient.get("lp") || "";
  }

  getRefreshToken() {
    return MemoryClient.get("rlp") || "";
  }

  async handleRefreshToken(originalConfig) {
    try {
      const rs = await this._axiosInstance.post("/auth/refresh-token", {
        oldToken: this.getRefreshToken(),
      });

      const { access_token, refresh_token } = rs.data.data;
      MemoryClient.set("lp", access_token);
      MemoryClient.set("rlp", refresh_token);

      return this._axiosInstance(originalConfig);
    } catch (_error) {
      return Promise.reject(_error);
    }
  }
}

export const axiosInstanceClient = new AxiosInstance();
