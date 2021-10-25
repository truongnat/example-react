import { Api } from "../config/api";
import { transformResponse } from "../utils";

export class Services {
  async login(data) {
    try {
      const response = await new Api().post("auth/login", data);
      return response;
    } catch (error) {
      console.log("error - login : ", error);
    }
  }
}
