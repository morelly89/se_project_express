const User = require("../models/user");
const {
  invalidDataPassed,
  userOrItemNotFoundError,
  defaultError,
  DEFAULT,
  NOT_FOUND,
  BAD_REQUEST,
} = require("../utils/errors");

const getUsers = (req, res) => {
  if (!req.params._id === null) {
    return res.status(400).send(invalidDataPassed);
  }
  return User.find({})
    .then((data) => res.status(200).send(data))
    .catch(() =>
      res.status(DEFAULT).send({ message: "Internal server error" })
    );
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  if (!name || !avatar) {
    return res.status(400).send(invalidDataPassed);
  }

  return User.create({ name, avatar })
    .then((data) => res.status(201).send(data))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data passed" });
      }
      return res.status(DEFAULT).send({ message: "Internal server error" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(BAD_REQUEST).send({ message: "invalid data passed" });
  }
  return User.findById(userId)
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
        res.status(BAD_REQUEST).send({ message: "Invalid data passed" });
      }
    });
};

module.exports = { getUsers, createUser, getUser };
