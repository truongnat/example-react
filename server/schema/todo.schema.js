const mongoose = require("mongoose");
const { Schema } = mongoose;
const uuid = require("node-uuid");

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
      enum: ["initial", "todo", "review", "done", "keeping"],
    },
  },
  {
    timestamps: true,
  }
);

const TodoRepo = mongoose.model("todos", todoSchema);
module.exports = { TodoRepo };
