const { Api } = require('../config/api');

export class SearchService {
  async searchUser(data) {
    try {
      return await new Api().fetch(`user/search?username=${data}`);
    } catch (error) {
      console.log('error - searchUser : ', error);
      return error;
    }
  }
}
