const { DEFAULT_AVATAR } = require("../constants");
const { Service } = require("../core");
const bcrypt = require("bcrypt");
const { UserRepository } = require("../schema");
const { NotFoundException } = require("../exceptions");

class UserService extends Service {
  async createUser({ username, password }) {
    try {
      const hashPassword = await bcrypt.hash(password, 10);

      return await UserRepository.create({
        username: username,
        password: hashPassword,
        avatar_url: DEFAULT_AVATAR,
      });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async getUserById(_id) {
    try {
      const user = await UserRepository.findOne({ _id });

      if (!user) {
        throw new NotFoundException(`User with id ${_id} not found`);
      }
      return user;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async updateUser(_id, userUpdate) {
    try {
      return await UserRepository.findByIdAndUpdate(
        { _id },
        {
          ...userUpdate,
        }
      );
    } catch (e) {
      throw new Error(e.message);
    }
  }
}

module.exports = new UserService();
