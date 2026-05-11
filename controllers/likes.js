const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-error");

const likeItem = (req, res, next) => {
  if (!req.params.itemId) {
    return next(new BadRequestError("Invalid data passed"));
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
        return next(new NotFoundError("User or item not found"));
      }
      return res.send(updatedItem);
    })
    .catch((err) => {
      if (err.name === "CastError" || err.name === "ValidationError") {
        return next(new BadRequestError("User or item not found"));
      }
      return next(err);
    });
};

const dislikeItem = (req, res, next) => {
  if (!req.params.itemId) {
    return next(new BadRequestError("User or item not found"));
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
        return next(new NotFoundError("User or item not found"));
      }
      return res.send(updatedItem);
    })
    .catch((err) => {
      if (err.name === "CastError" || err.name === "ValidationError") {
        return next(new BadRequestError("User or item not found"));
      }
      return next(err);
    });
};

module.exports = { likeItem, dislikeItem };
