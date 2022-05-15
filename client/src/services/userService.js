export class UserService {
  _path = "/user";
  _axios;

  constructor(axiosInstance) {
    this._axios = axiosInstance;
  }

  async updateUser(data) {
    try {
      return await this._axios.put(`${this._path}/update`, data);
    } catch (e) {
      return e;
    }
  }

  async searchUser(data) {
    try {
      return await this._axios.fetch(`${this._path}/search?email=${data}`);
    } catch (e) {
      return e;
    }
  }
}
