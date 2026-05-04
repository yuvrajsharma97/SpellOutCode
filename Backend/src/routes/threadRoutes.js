const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");
const upload = require("../middleware/upload");
const {
  createThread,
  getUserThreads,
  getThread,
  updateThread,
  updateThreadCover,
  deleteThread,
} = require("../controllers/threadController");

router.get("/user/:userId", getUserThreads); 
router.get("/:slug", getThread);

router.use(protect); 

router.post("/", createThread);
router.patch("/:id", updateThread);
router.patch("/:id/cover", upload.single("cover"), updateThreadCover);
router.delete("/:id", deleteThread);

module.exports = router;
