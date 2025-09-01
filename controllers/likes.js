const ClothingItem = require("../models/clothingItem");
const {
  invalidDataPassed,
  userOrItemNotFoundError,
  defaultError,
} = require("../utils/errors");

const likeItem = (req, res) => {
  if (!req.params.itemId) {
    return res.status(400).send(invalidDataPassed);
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
        return res.status(404).send(userOrItemNotFoundError);
      }
      return res.send(updatedItem);
    })
    .catch((err) => {
      if (err.name === "CastError" || err.name === "ValidationError") {
        return res.status(400).send(invalidDataPassed);
      }
      return res.status(500).send(defaultError);
    });
};

const dislikeItem = (req, res) => {
  if (!req.params.itemId) {
    return res.status(400).send(invalidDataPassed);
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
        return res.status(404).send(userOrItemNotFoundError);
      }
      return res.send(updatedItem);
    })
    .catch((err) => {
      if (err.name === "CastError" || err.name === "ValidationError") {
        return res.status(400).send(invalidDataPassed);
      }
      return res.status(500).send(defaultError);
    });
};

module.exports = { likeItem, dislikeItem };
