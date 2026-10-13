const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const { getMyProfile,updateMyProfile,updateProfileImage, getMyProfileImage } = require("../controllers/employeeController");

const router = express.Router();

// Employee-only routes
router.use(protect);
router.use(authorize("employee"));

router.get("/me", getMyProfile);
router.put("/me", updateMyProfile);
router.put(
  "/me/image",
  (req, res, next) => {
    upload.single("image")(req, res, (error) => {
      if (error) {
        return res.status(400).json({
          success: false,
          message:
            error.code === "LIMIT_FILE_SIZE"
              ? "Image size must not exceed 2 MB"
              : error.code === "LIMIT_UNEXPECTED_FILE"
              ? "Please upload one image using the field name 'image'"
              : error.message || "Image upload failed",
        });
      }

      next();
    });
  },
  updateProfileImage
);

router.get("/me/image", getMyProfileImage);

module.exports = router;