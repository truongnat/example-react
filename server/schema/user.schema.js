const mongoose = require("mongoose");
const { Schema } = mongoose;
const uuid = require("node-uuid");

const userSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => uuid.v4(),
    },
    username: String,
    password: String,
    avatarUrl: String,
    email: String,
    otp: String,
    active: {
      type: Boolean,
      default: () => true,
    },
    isOnline: {
      type: Boolean,
      default: () => false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);
