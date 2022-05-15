const mongoose = require("mongoose");
const { Schema } = mongoose;
const uuid = require("node-uuid");

const roomSchema = new Schema(
  {
    _id: {
      type: String,
      default: function () {
        return uuid.v4();
      },
    },
    name: String,
    avatarUrl: String,
    author: {
      type: String,
      default: function () {
        return uuid.v4();
      },
    },
    lastMessage: {
      type: String,
      default: function () {
        return uuid.v4();
      },
    },
    participants: Array,
    messages: Array,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("room", roomSchema);
