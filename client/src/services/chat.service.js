export class ChatService {
  _path = "/chat";
  _axios;

  constructor(axiosInstance) {
    this._axios = axiosInstance;
  }

  async createRoom(data) {
    try {
      return await this._axios.post(`${this._path}/create-room`, data);
    } catch (e) {
      return e;
    }
  }

  async updateRoom(id, data) {
    try {
      return await this._axios.put(`${this._path}/update-room/${id}`, data);
    } catch (e) {
      return e;
    }
  }

  async getRooms() {
    try {
      return await this._axios.fetch(`${this._path}/rooms`);
    } catch (e) {
      return e;
    }
  }

  async deleteRoom(id) {
    try {
      return await this._axios.delete(`${this._path}/delete-room/${id}`);
    } catch (e) {
      return e;
    }
  }

  async getRoomDetail(id) {
    try {
      return await this._axios.fetch(`${this._path}/room/${id}`);
    } catch (e) {
      return e;
    }
  }
}
