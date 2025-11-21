const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingItems");
const auth = require("../middlewares/auth");
const { createUser, login } = require("../controllers/users");

router.use("/users", auth, userRouter);
router.use("/items", auth, clothingItem);

router.post("/signup", createUser);
router.post("/signin", login);

module.exports = router;
