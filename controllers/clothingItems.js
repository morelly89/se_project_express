const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, NOT_FOUND, DEFAULT } = require("../utils/errors");
const { Types } = require("mongoose");

const createItem = (req, res) => {
  const { imageUrl, weather, name } = req.body;
  if (!imageUrl || !weather || !name) {
    return res.status(BAD_REQUEST).send({ message: "Invalid data passed" });
  }

  return ClothingItem.create({ imageUrl, weather, name, owner: req.user._id })
    .then((item) => {
      if (!item) {
        return res.status(BAD_REQUEST).send({ message: "Invalid data passed" });
      }
      return res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data passed" });
      }
      return res.status(DEFAULT).send({ message: "internal server error" });
    });
};

const getItems = (req, res) =>
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(() => {
      res.status(DEFAULT).send({ message: "internal server error" });
    });

async function deleteItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const { _id: userId } = req.user;

    if (!Types.ObjectId.isValid(itemId)) {
      return res.status(BAD_REQUEST).send({ message: "Invalid item id" });
    }

    const deleted = await ClothingItem.findOneAndDelete({
      _id: itemId,
      owner: userId,
    });

    if (!deleted) {
      return res.status(NOT_FOUND).send({ message: "Item not found" });
    }

    return res.status(204).send("Deletion was successful");
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid data passed" });
    }
    return next(err);
  }
}

module.exports = { createItem, getItems, deleteItem };
