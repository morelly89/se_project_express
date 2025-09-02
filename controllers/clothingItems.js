const ClothingItem = require("../models/clothingItem");
const {
  invalidDataPassed,
  userOrItemNotFoundError,
  defaultError,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { imageUrl, weather, name } = req.body;
  if (!imageUrl || !weather || !name) {
    return res.status(400).send(invalidDataPassed);
  }

  return ClothingItem.create({ imageUrl, weather, name, owner: req.user._id })
    .then((item) => {
      if (!item) {
        return res.status(400).send(invalidDataPassed);
      }
      return res.send({ data: item });
    })
    .catch(() => res.status(400).send(defaultError));
};

const getItems = (req, res) =>
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(() => {
      res.status(500).send(defaultError);
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
        return res.status(404).send(userOrItemNotFoundError);
      }
      if (err.name === "CastError") {
        return res.status(400).send(invalidDataPassed);
      }
      return res.status(500).send(defaultError);
    });
};

module.exports = { createItem, getItems, deleteItem };
