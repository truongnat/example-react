const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const { connectMongoose } = require("./connection");
const authRouter = require("./router/user.router");
const todosRouter = require("./router/todos.router");
const path = require("path");
connectMongoose();
app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "build")));
app.use("/auth", authRouter);
app.use("/todos", todosRouter);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./build/index.html"));
});

app.listen(5000, () => {
  console.log("server on started");
});
