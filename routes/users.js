const router = require("express").Router();

const { getUsers, createUser, getUser } = require("../controllers/users");

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:userId", getUser);

router.post("/", (req, res) => {
  res.send("User created");
});

module.exports = router;
