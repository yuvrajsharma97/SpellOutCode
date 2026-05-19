const { Router } = require("express");
const {
  createUpdate,
  editUpdate,
  deleteUpdate,
  getUpdatesByProject,
} = require("../controllers/updateController");
const protect = require("../middleware/authMiddleware");

const router = Router();

// ── Public routes
router.get("/:projectId/updates", getUpdatesByProject);

router.use(protect);

// ── Protected routes 
router.post("/create", createUpdate);
router.patch("/update/:id", editUpdate);
router.delete("/delete/:id", deleteUpdate);

module.exports = router;
