const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingItems");
const auth = require("../middlewares/auth");
const { createUser, login } = require("../controllers/users");

router.use("/items", clothingItem);

router.post("/signup", createUser);
router.post("/signin", login);

router.use("/users", auth, userRouter);
module.exports = router;
