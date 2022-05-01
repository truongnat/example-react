import axios from "axios";
import { StatusCode } from "../constants";
import { MemoryClient } from "../utils";

// const baseURLMock = "https://jsonplaceholder.typicode.com/";
const baseURL = "http://localhost:5000/";
/**
 * @Api Custom class base axios auto inject token header on session storage.
 * @support fetch - post - put - patch - delete.
 * */
export class Api {
  _axiosInstance;

  constructor() {
    this._axiosInstance = axios.create({
      baseURL:
        process.env.NODE_ENV === "production"
          ? process.env.REACT_APP_BASE_URL
          : baseURL,
      headers: { ...this.getHeader() },
      timeout: 10000,
    });

    this._axiosInstance.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return error;
      }
    );

    this._axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response.status === StatusCode.UnAuthorized &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          await this._axiosInstance
            .post("/auth/refresh-token", {
              oldToken: this.getToken(),
            })
            .then((res) => {
              if (res.status === StatusCode.Created) {
                console.log(
                  "🚀 ~ file: api.js ~ line 68 ~ Api ~ constructor ~ res",
                  res
                );
              } else {
                MemoryClient.clearAll();
              }
            });
        }

        return error;
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
      Authorization: "Bearer " + this.getToken(),
      "Content-Type": "application/json",
    };
  }

  getToken() {
    return MemoryClient.get("lp") || "";
  }
}
