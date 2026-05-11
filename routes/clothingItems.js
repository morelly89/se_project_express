const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  createItem,
  getItems,
  deleteItem,
} = require("../controllers/clothingItems");
const {
  validateCardBody,
  validateItemId,
} = require("../middlewares/validation");

const { likeItem, dislikeItem } = require("../controllers/likes");

router.get("/", getItems);
router.use(auth);
router.post("/", validateCardBody, createItem);
router.delete("/:itemId", validateItemId, deleteItem);
router.put("/:itemId/likes", validateItemId, likeItem);
router.delete("/:itemId/likes", validateItemId, dislikeItem);

module.exports = router;
