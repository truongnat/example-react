const mongoose = require('mongoose');
const { Schema } = mongoose;
const uuid = require('node-uuid');
const { UserRepo } = require('./user.schema');

const roomSchema = new Schema(
  {
    _id: {
      type: String,
      default: function () {
        return uuid.v4();
      },
    },
    name: String,
    author: UserRepo,
    lastMessage: String,
    lastUserSend: UserRepo,
    avatarUrl: String,
    isDeleted: Boolean,
  },
  {
    timestamps: true,
  }
);

const RoomRepo = mongoose.model('room', roomSchema);
module.exports = { RoomRepo };
