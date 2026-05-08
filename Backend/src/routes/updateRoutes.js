const { Router } = require("express");
const {
  createUpdate,
  getUpdatesByProject,
  getUpdateById,
  editUpdate,
  deleteUpdate,
} = require("../controllers/updateController");
const protect = require("../middleware/authMiddleware");

const router = Router();

// ── Public routes
router.get("/project/:projectId", getUpdatesByProject);
router.get("/getUpdate/:id", getUpdateById);

router.use(protect);

// ── Protected routes 
router.post("/create", createUpdate);
router.patch("/update/:id", editUpdate);
router.delete("/delete/:id", deleteUpdate);

module.exports = router;
