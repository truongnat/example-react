import { Api } from "../config/api";
import { transformResponse } from "../utils";

export class Services {
  async getUsers() {
    try {
      const response = await new Api().fetch("users");
      return transformResponse(response);
    } catch (error) {
      console.log("error - getUser : ", error);
    }
  }
}
