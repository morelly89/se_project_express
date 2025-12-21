const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  DEFAULT,
  NOT_FOUND,
  BAD_REQUEST,
  CONFLICT,
  UNAUTHORIZED,
} = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  if (!name || !avatar || !email || !password) {
    return res.status(BAD_REQUEST).send({ message: "Invalid data passed" });
  }

  return bcrypt
    .hash(req.body.password, 10)

    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      return res.status(201).send(userObj);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data passed" });
      }
      if (err.code === 11000) {
        return res.status(CONFLICT).send({ message: "Email already in use" });
      }
      return res.status(DEFAULT).send({ message: "Internal server error" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(BAD_REQUEST).send({ message: "Invalid data passed" });
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      res.status(UNAUTHORIZED).send({ message: err.message });
    });
};

const getCurrentUser = (req, res) => {
  const { _id } = req.user;
  if (!_id) {
    return res.status(BAD_REQUEST).send({ message: "invalid data passed" });
  }
  return User.findById(_id)
    .then((data) => {
      if (!data) {
        return res
          .status(NOT_FOUND)
          .send({ message: "User or item not found" });
      }
      return res.status(200).send(data);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
      }

      return res.status(DEFAULT).send({ message: "Internal server error" });
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  const { _id } = req.user;
  if (!name || !avatar || !_id) {
    return res.status(BAD_REQUEST).send({ message: "Invalid data passed" });
  }
  return User.findByIdAndUpdate(
    _id,
    { $set: { name, avatar } },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data passed" });
      }
      return res.status(DEFAULT).send({ message: "Internal server error" });
    });
};

module.exports = { createUser, login, getCurrentUser, updateProfile };
