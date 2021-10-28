import { Api } from "../config/api";

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
