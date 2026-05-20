const { Router } = require("express");
const { editUpdate, deleteUpdate } = require("../controllers/updateController");

const protect = require("../middleware/authMiddleware");

const router = Router();

router.use(protect);

router.patch("/:id", editUpdate);
router.delete("/:id", deleteUpdate);

module.exports = router;
