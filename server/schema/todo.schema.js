const mongoose = require("mongoose");
const { Schema } = mongoose;
const uuid = require("node-uuid");
const { STATUS_TODO } = require("../constants");

const todoSchema = new Schema(
  {
    _id: {
      type: String,
      default: function () {
        return uuid.v4();
      },
    },
    title: String,
    content: String,
    userId: String,
    status: {
      type: String,
      enum: STATUS_TODO,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("todo", todoSchema);
