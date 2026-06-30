const { Types } = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-error");
const ForbiddenError = require("../errors/forbidden-error");

const createItem = (req, res, next) => {
  const { imageUrl, weather, name } = req.body;
  if (!imageUrl || !weather || !name) {
    return next(new BadRequestError("Invalid data passed"));
  }

  return ClothingItem.create({ imageUrl, weather, name, owner: req.user._id })
    .then((item) => {
      if (!item) {
        return next(new BadRequestError("Invalid data passed"));
      }
      return res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data passed"));
      }
      return next(err);
    });
};

const getItems = (req, res, next) =>
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => next(err));

async function deleteItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const { _id: userId } = req.user;

    if (!Types.ObjectId.isValid(itemId)) {
      return next(new BadRequestError("Invalid data passed"));
    }

    const item = await ClothingItem.findById(itemId);

    if (!item) {
      return next(new NotFoundError("Item not found"));
    }

    if (item.owner.toString() !== userId.toString()) {
      return next(
        new ForbiddenError("You are not allowed to delete this item")
      );
    }

    await item.deleteOne();

    return res.status(200).send({ message: "Item was successfully deleted" });
  } catch (err) {
    return next(err);
  }
}

module.exports = { createItem, getItems, deleteItem };
