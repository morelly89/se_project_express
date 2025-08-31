const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingItems");
const { likeItem, dislikeItem } = require("../controllers/likes");

router.put("/items/:itemId/likes", likeItem);
router.delete("/items/:itemId/likes", dislikeItem);
router.use("/users", userRouter);
router.use("/items", clothingItem);
module.exports = router;
