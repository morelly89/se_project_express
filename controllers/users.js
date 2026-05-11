const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const NotFoundError = require("../errors/not-found-error");
const BadRequestError = require("../errors/bad-request-error");
const ConflictError = require("../errors/conflict-error");
const UnauthorizedError = require("../errors/unauthorized-error");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  if (!name || !avatar || !email || !password) {
    return next(new BadRequestError("Invalid data passed"));
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
        return next(new BadRequestError("Invalid data passed"));
      }
      if (err.code === 11000) {
        return next(new ConflictError("Email already in use"));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestError("Invalid data passed"));
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      return next(new UnauthorizedError("Incorrect email or password"));
    });
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  if (!_id) {
    return next(new BadRequestError("Invalid data passed"));
  }
  return User.findById(_id)
    .then((data) => {
      if (!data) {
        return next(new NotFoundError("User or item not found"));
      }
      return res.status(200).send(data);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user id"));
      }

      return next(err);
    });
};

const updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;
  const { _id } = req.user;
  if (!name || !avatar || !_id) {
    return next(new BadRequestError("Invalid data passed"));
  }
  return User.findByIdAndUpdate(
    _id,
    { $set: { name, avatar } },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("User ot item not found"));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data passed"));
      }
      return next(err);
    });
};

module.exports = { createUser, login, getCurrentUser, updateProfile };
