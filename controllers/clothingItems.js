const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, NOT_FOUND, DEFAULT } = require("../utils/errors");

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

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  return ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => {
      res.status(200).send({});
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "User or item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data passed" });
      }
      return res.status(DEFAULT).send({ message: "Server internal error" });
    });
};

module.exports = { createItem, getItems, deleteItem };
