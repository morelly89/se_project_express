const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
require("dotenv").config();
const { errors } = require("celebrate");

const { requestLogger, errorLogger } = require("./middlewares/logger");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const NotFoundError = require("./errors/not-found-error");

const app = express();

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {})
  .catch((err) => {
    throw new Error(`MongoDB connection failed: ${err.message}`);
  });

app.use(cors());
app.use(express.json());

// request logger should go BEFORE routes
app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// main routes
app.use("/", mainRouter);

// 404 handler
app.use((req, res, next) =>
  next(new NotFoundError("Requested resource not found"))
);

// error logger should go AFTER routes and 404, but BEFORE error handlers
app.use(errorLogger);

// celebrate error handler
app.use(errors());

// centralized error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
