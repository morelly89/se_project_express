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
  user
    .find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(500).send(defaultError);
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  if (!name || !avatar) {
    console.log(name, avatar);
    return res.status(400).send(invalidDataPassed);
  }
  console.log(req.body);

  user
    .create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.log(err);
      return res.status(500).send(defaultError);
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).send(invalidDataPassed);
  }
  console.log("_id", userId);
  user
    .findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send(userOrItemNotFoundError);
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      return res.status(400).send(defaultError);
    });
};

module.exports = { getUsers, createUser, getUser };
