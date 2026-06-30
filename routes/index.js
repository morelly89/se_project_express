const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingItems");
const auth = require("../middlewares/auth");
const { createUser, login } = require("../controllers/users");
const {
  validateUserBody,
  validateLogin,
} = require("../middlewares/validation");

router.use("/items", clothingItem);

router.post("/signup", validateUserBody, createUser);
router.post("/signin", validateLogin, login);

router.use("/users", auth, userRouter);
module.exports = router;
