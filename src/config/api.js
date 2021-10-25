import axios from "axios";
import { MemoryClient } from "../utils";

const baseURLMock = "https://jsonplaceholder.typicode.com/";
const baseURL = "http://localhost:5000/";
/**
 * @Api Custom class base axios auto inject token header on session storage.
 * @support fetch - post - put - patch - delete.
 * */
export class Api {
  constructor() {}
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
    const token = MemoryClient.get("lp");
    console.log("getHeader - look token : ", token);
    return {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
  }
}
