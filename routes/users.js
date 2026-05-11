const router = require("express").Router();

const { getCurrentUser, updateProfile } = require("../controllers/users");

router.get("/me", getCurrentUser);
router.patch("/me", updateProfile); //here where i can define the shape of my joi schema? correct?

module.exports = router;
