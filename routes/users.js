const { getUsers, createUser, getUser } = require("../controllers/users");

const router = require("express").Router();

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:userId", getUser);

router.post("/", (req, res) => {
  console.log("POST users");
  res.send("User created");
});

module.exports = router;
