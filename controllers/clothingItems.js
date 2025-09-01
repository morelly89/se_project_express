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

  return ClothingItem.create({ imageUrl, weather, name })
    .then((item) => {
      if (!item) {
        return res.status(400).send(invalidDataPassed);
      }
      return res.send({ data: item });
    })
    .catch(() => res.status(400).send(defaultError));
};

const getItem = (req, res) =>
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(() => {
      res.status(500).send(defaultError);
    });

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  if (!itemId || !imageUrl) {
    return res.status(400).send(invalidDataPassed);
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $set: { imageUrl } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send(userOrItemNotFoundError);
      }
      return res.status(500).send(defaultError);
    });
};

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

module.exports = { createItem, getItem, updateItem, deleteItem };
