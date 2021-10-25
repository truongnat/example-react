import { MemoryClient } from "../utils";

const { Api } = require("../config/api");

export class Authenticate {
  async login(data) {
    try {
      const response = await new Api().post("auth/login", data);
      return response;
    } catch (error) {
      console.log("error - login : ", error);
    }
  }

  async checkingMe() {
    try {
      const response = await new Api().fetch("auth/checking-me");
      if (response.data.status === 200) {
        return true;
      }
      return false;
    } catch (e) {
      console.log("error - checkingMe : ", e);
      return false;
    }
  }

  async isAuthenticated() {
    const token = MemoryClient.get("lp");
    if (!token) return false;
    const checkingToken = await this.checkingMe();
    if (!checkingToken) return false;
    return true;
  }
}
