const express = require("express");
const { login } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/login", login);

router.get("/me", protect, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});


router.get( "/admin-check", protect, authorize("admin"),(req, res) => {
    res.status(200).json({
      success: true,
      message: "Admin access granted",
    });
  }
);

module.exports = router;