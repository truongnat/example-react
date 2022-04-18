const mongoose = require('mongoose');
const { Schema } = mongoose;
const uuid = require('node-uuid');
const { UserRepo } = require('./user.schema');

const messageSchema = new Schema(
  {
    _id: {
      type: String,
      default: function () {
        return uuid.v4();
      },
    },
    content: String,
    author: UserRepo,
    isDeleted: Boolean,
  },
  {
    timestamps: true,
  }
);

const MessageRepo = mongoose.model('message', messageSchema);
module.exports = { MessageRepo };
