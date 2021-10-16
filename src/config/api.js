import axios from "axios";
import { FakeCookie } from "../utils";

const baseURL = "https://jsonplaceholder.typicode.com/";

/**
 * @Api Custom class base axios auto inject token header on session storage.
 * @support fetch - post - put - patch - delete.
 * */
export class Api {
  axiosInstance = axios.create({
    baseURL: baseURL,
    headers: { ...this.getHeader() },
  });

  /**
   * @fetch method auto inject header token.
   * @param url - { String }.
   * @response Promise axios get method.
   * */
  fetch(url) {
    return this.axiosInstance.get(url);
  }

  /**
   * @post method auto inject header token.
   * @param url - { String }, payload - { String }.
   * @response Promise axios post method.
   * */
  post(url, payload) {
    return this.axiosInstance.post(url, payload);
  }

  /**
   * @put method auto inject header token.
   * @param url - { String }, payload - { String }.
   * @response Promise axios put method.
   * */
  put(url, payload) {
    return this.axiosInstance.put(url, payload);
  }

  /**
   * @patch method auto inject header token.
   * @param url - { String }, payload - { String }.
   * @response Promise axios patch method.
   * */
  patch(url, payload) {
    return this.axiosInstance.patch(url, payload);
  }

  /**
   * @delete method auto inject header token.
   * @param url - { String }, payload - { String }.
   * @response Promise axios delete method.
   * */
  delete(url, payload) {
    return this.axiosInstance.delete(url, payload);
  }

  /**
   * @get token header from session storage.
   * @return Header axios object.
   * */
  getHeader() {
    const token = FakeCookie.get("lp");
    return {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
  }
}
