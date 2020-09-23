const router = require("express").Router();

const { profileController } = require("../controllers");

router.get("/profile/:id", profileController.getProfileByID);
router.get("/profile", profileController.getAllProfile);

module.exports = router;
