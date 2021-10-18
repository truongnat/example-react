import { Api } from "../config/api";
import { transformResponse } from "../utils";

export class Services {
  async getUsers() {
    try {
      const response = await new Api("mock").fetch("users");
      return transformResponse(response);
    } catch (error) {
      console.log("error - getUser : ", error);
    }
  }
  async login(data) {
    try {
      const response = await new Api().post("auth/login", data);
      return response;
    } catch (error) {
      console.log("error - login : ", error);
    }
  }
}
