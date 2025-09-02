const mongoose = require("mongoose");
const express = require("express");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {})
  .catch((err) => console.error(err));
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: "688a8db9f17d54e6e626aa6a",
  };
  next();
});
app.use("/", mainRouter);

app.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found!" });
});

app.listen(PORT, () => {});
