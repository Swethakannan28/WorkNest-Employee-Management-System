const User = require("../models/User");

const {
  updateProfileSchema,
} = require("../validators/profileValidator");

const fs = require("fs/promises");
const path = require("path");

const {
  saveProfileImage,
  UPLOAD_DIR,
} = require("../utils/saveProfileImage");



const getMyProfile = async (req, res) => {
  try {
    const employee = await User.findOne({
      _id: req.user._id,
      role: "employee",
      isActive: true,
    }).select("-__v");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    console.error("Get Profile Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};


const updateMyProfile = async (req, res) => {
  try {
    const { error, value } = updateProfileSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((item) => item.message),
      });
    }

    const employee = await User.findOne({
      _id: req.user._id,
      role: "employee",
      isActive: true,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    Object.assign(employee, value);

    await employee.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      employee,
    });
  } catch (error) {
    console.error("Update Profile Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};



const updateProfileImage = async (req, res) => {
  let newImage = null;
  let imageSavedToDatabase = false;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a profile image",
      });
    }

    const employee = await User.findOne({
      _id: req.user._id,
      role: "employee",
      isActive: true,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Save new image
    newImage = await saveProfileImage(req.file);

    // Remember previous image filename
    const oldFilename = employee.profileImage?.filename;

    // Update image details in MongoDB
    employee.profileImage = newImage;

    await employee.save();
    imageSavedToDatabase = true;

    // Delete previous image after successful database update
    if (oldFilename) {
      try {
        const oldImagePath = path.join(
          UPLOAD_DIR,
          path.basename(oldFilename)
        );

        await fs.unlink(oldImagePath);
      } catch (error) {
        console.error("Old Image Cleanup Error:", error.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      profileImage: {
        filename: newImage.filename,
        originalName: newImage.originalName,
        mimeType: newImage.mimeType,
        size: newImage.size,
      },
    });
  } catch (error) {
    // Remove new image only if database update was unsuccessful
    if (newImage?.path && !imageSavedToDatabase) {
      try {
        await fs.unlink(newImage.path);
      } catch (cleanupError) {
        console.error("Image Cleanup Error:", cleanupError.message);
      }
    }

    console.error("Profile Image Error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.statusCode === 400
          ? error.message
          : "Failed to update profile image",
    });
  }
};

// ==========================================
// 4. VIEW OWN PROFILE IMAGE
// ==========================================

const getMyProfileImage = async (req, res) => {
  try {
    const employee = await User.findOne({
      _id: req.user._id,
      role: "employee",
      isActive: true,
    });

    if (!employee || !employee.profileImage?.filename) {
      return res.status(404).json({
        success: false,
        message: "Profile image not found",
      });
    }

    const filename = path.basename(employee.profileImage.filename);

    const imagePath = path.join(UPLOAD_DIR, filename);

    await fs.access(imagePath);

    res.setHeader("Content-Type", employee.profileImage.mimeType);
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");

    return res.sendFile(imagePath);
  } catch (error) {
    if (error.code === "ENOENT") {
      return res.status(404).json({
        success: false,
        message: "Image file not found",
      });
    }

    console.error("Get Profile Image Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile image",
    });
  }
};



module.exports = {
  getMyProfile,
  updateMyProfile,
  updateProfileImage,
  getMyProfileImage,
};