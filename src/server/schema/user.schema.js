const mongoose = require("mongoose");
const { Schema } = mongoose;
const uuid = require("node-uuid");

const userSchema = new Schema(
  {
    _id: {
      type: String,
      default: function () {
        return uuid.v4();
      },
    },
    username: String,
    password: String,
  },
  {
    timestamps: true,
  }
);

const UserRepo = mongoose.model("users", userSchema);
module.exports = { UserRepo };
