const mongoose = require("mongoose");
const { Schema } = mongoose;
const uuid = require("node-uuid");

const messageSchema = new Schema(
  {
    _id: {
      type: String,
      default: function () {
        return uuid.v4();
      },
    },
    content: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    isDeleted: Boolean,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("message", messageSchema);