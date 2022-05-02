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
    author: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    lastMessage: String,
    lastUserSend: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    avatarUrl: String,
    isDeleted: Boolean,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("room", roomSchema);