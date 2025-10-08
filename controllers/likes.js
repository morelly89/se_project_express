const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, NOT_FOUND, DEFAULT } = require("../utils/errors");

const likeItem = (req, res) => {
  if (!req.params.itemId) {
    return res.status(BAD_REQUEST).send({ message: "Invalid data passed" });
  }

  return ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true }
  )
    .then((updatedItem) => {
      if (!updatedItem) {
        return res
          .status(NOT_FOUND)
          .send({ message: "User or item not found" });
      }
      return res.send(updatedItem);
    })
    .catch((err) => {
      if (err.name === "CastError" || err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data Passed" });
      }
      return res.status(DEFAULT).send({ message: "internal server error" });
    });
};

const dislikeItem = (req, res) => {
  if (!req.params.itemId) {
    return res.status(BAD_REQUEST).send({ message: "invalid data passed" });
  }

  return ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true }
  )
    .then((updatedItem) => {
      if (!updatedItem) {
        return res
          .status(NOT_FOUND)
          .send({ message: "User or item not found" });
      }
      return res.send(updatedItem);
    })
    .catch((err) => {
      if (err.name === "CastError" || err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "invalid data passed" });
      }
      return res.status(DEFAULT).send({ message: "internal Server error" });
    });
};

module.exports = { likeItem, dislikeItem };
