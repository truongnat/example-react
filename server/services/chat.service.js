const { Service } = require("../core");
const { RoomRepository, UserRepository } = require("../schema");
const { DEFAULT_AVATAR } = require("../constants");
const { MessageRepository } = require("../schema");
const { BadRequestException } = require("../exceptions");

class ChatService extends Service {
  constructor() {
    super();
  }

  async createNewRoom(data) {
    try {
      const { name, author, lastMessage } = data;
      return await RoomRepository.create({
        name,
        author,
        lastMessage,
      });
    } catch (e) {
      return e.message;
    }
  }

  async getRoomByKey(key, value) {
    try {
      return await RoomRepository.findOne({ [key]: value });
    } catch (e) {
      return e.message;
    }
  }

  async updateRoomInfo(_id, data) {
    try {
      return await RoomRepository.findByIdAndUpdate(
        { _id },
        {
          ...data,
        }
      );
    } catch (e) {
      return e.message;
    }
  }

  async deleteRoom(_id) {
    try {
      return await RoomRepository.findByIdAndDelete({ _id });
    } catch (e) {
      return e.message;
    }
  }

  async getRoomsWithUser(userId) {
    return await RoomRepository.find({ author: userId });
  }

  // messages

  async createMessage(authorId, roomId, data) {
    try {
      return await MessageRepository.create({
        content: data.content,
        author: authorId,
        room: roomId,
      });
    } catch (e) {
      return e.message;
    }
  }

  async deleteMessage(_id) {
    try {
      return await MessageRepository.findOneAndUpdate(
        { _id },
        {
          isDeleted: true,
        }
      );
    } catch (e) {
      return e.message;
    }
  }

  async validateCreateRoom(roomInfo) {
    const roomExist = await this.getRoomByKey("name", roomInfo.name);
    if (roomExist) {
      return new BadRequestException("Name room existing!");
    }
    return this.createNewRoom(roomInfo);
  }
}

module.exports = new ChatService();
