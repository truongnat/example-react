import { MemoryClient } from "../utils";

export class AuthService {
  _path = "/auth";
  _axios;
  constructor(axiosInstance) {
    this._axios = axiosInstance;
  }

  async login(data) {
    try {
      return await this._axios.post(`${this._path}/login`, data);
    } catch (e) {
      console.log(
        "🚀 ~ file: authService.js ~ line 12 ~ AuthService ~ login ~ e",
        e
      );
      return e;
    }
  }

  async register(data) {
    try {
      return await this._axios.post(`${this._path}/register`, data);
    } catch (e) {
      console.log(
        "🚀 ~ file: authService.js ~ line 23 ~ AuthService ~ register ~ e",
        e
      );

      return e;
    }
  }

  async whoAmI() {
    try {
      return await this._axios.fetch(`${this._path}/me`);
    } catch (e) {
      console.log(
        "🚀 ~ file: authService.js ~ line 37 ~ AuthService ~ whoAmI ~ e",
        e
      );
      return e;
    }
  }

  async isAuthenticated() {
    const token = MemoryClient.get("lp");
    if (!token) return false;
    const response = await this.whoAmI();
    return !!response.data;
  }

  async forgotPassword(data) {
    try {
      return await this._axios.post(`${this._path}/forgot-password`, data);
    } catch (e) {
      console.log(
        "🚀 ~ file: authService.js ~ line 58 ~ AuthService ~ forgotPassword ~ e",
        e
      );
      return e;
    }
  }

  async verifyOtpForgot(data) {
    try {
      return await this._axios.post(`${this._path}/verify-otp-forgot`, data);
    } catch (e) {
      console.log(
        "🚀 ~ file: authService.js ~ line 70 ~ AuthService ~ verifyOtpForgot ~ e",
        e
      );

      return e;
    }
  }
}
