const mongoose = require("mongoose");
require("dotenv").config();

async function connectMongoose() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      autoCreate: true,
      autoIndex: true,
    });
    console.log("Mongodb connected");
  } catch (error) {
    console.log("connection mongodb error : ", error);
  }
}

module.exports = { connectMongoose };
