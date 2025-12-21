const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {
  createItem,
  getItems,
  deleteItem,
} = require("../controllers/clothingItems");

const { likeItem, dislikeItem } = require("../controllers/likes");

router.get("/", getItems);
router.use(auth);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
