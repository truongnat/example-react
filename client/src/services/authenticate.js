import {MemoryClient} from "../utils";

const {Api} = require("../config/api");

export class Authenticate {
  async login(data) {
    try {
      return await new Api().post("auth/login", data);
    } catch (error) {
      console.log("error - login : ", error);
    }
  }

  async register(data) {
    try {
      return await new Api().post("auth/register", data);
    } catch (error) {
      console.log("error - login : ", error);
    }
  }

  async checkingMe() {
    try {
      const response = await new Api().fetch("auth/checking-me");
      if (response.data.status === 200) {
        MemoryClient.set("anonymous_user", response.data.data._id);
        return response.data;
      }
      MemoryClient.remove("anonymous_user");
      return null;
    } catch (e) {
      console.log("error - checkingMe : ", e);
      return null;
    }
  }

  async isAuthenticated() {
    const token = MemoryClient.get("lp");
    if (!token) return false;
    const dataUser = await this.checkingMe();
    if (!dataUser.data) return null;
    return dataUser.data;
  }
}
