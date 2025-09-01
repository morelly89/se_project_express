const user = require("../models/user");
const {
  invalidDataPassed,
  userOrItemNotFoundError,
  defaultError,
} = require("../utils/errors");

const getUsers = (req, res) => {
  if (!req.params._id === null) {
    return res.status(400).send(invalidDataPassed);
  }
  return user
    .find({})
    .then((data) => res.status(200).send(data))
    .catch(() => res.status(500).send(defaultError));
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  if (!name || !avatar) {
    return res.status(400).send(invalidDataPassed);
  }

  return user
    .create({ name, avatar })
    .then((data) => res.status(201).send(data))
    .catch(() => res.status(500).send(defaultError));
};

const getUser = (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).send(invalidDataPassed);
  }
  return user
    .findById(userId)
    .then((data) => {
      if (!data) {
        return res.status(404).send(userOrItemNotFoundError);
      }
      return res.status(200).send(data);
    })
    .catch(() => res.status(400).send(defaultError));
};

module.exports = { getUsers, createUser, getUser };
