const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("OK");
});

app.listen(5000, () => {
  console.log("server on started");
});
