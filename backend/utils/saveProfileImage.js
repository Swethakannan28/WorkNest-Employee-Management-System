const fs = require("fs/promises");
const path = require("path");
const { randomUUID } = require("crypto");
const FileType = require("file-type");

// Folder where employee profile images will be stored
const UPLOAD_DIR = path.join(
  __dirname,
  "..",
  "uploads",
  "profiles"
);

// Allowed image formats
const allowedTypes = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const saveProfileImage = async (file) => {
  // Check the actual image format
  const detected = await FileType.fromBuffer(file.buffer);

  if (!detected || !allowedTypes[detected.mime]) {
    const error = new Error(
      "Invalid image. Only JPG, PNG and WebP are allowed"
    );

    error.statusCode = 400;
    throw error;
  }

  // Check whether actual file type matches uploaded MIME type
  if (detected.mime !== file.mimetype) {
    const error = new Error("Image file type mismatch");

    error.statusCode = 400;
    throw error;
  }

  // Generate a unique filename
  const filename = `${randomUUID()}.${allowedTypes[detected.mime]}`;

  // Create folder if it does not exist
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const filePath = path.join(UPLOAD_DIR, filename);

  // Save the image
  await fs.writeFile(filePath, file.buffer, { flag: "wx" });

  return {
    filename,
    originalName: path.basename(file.originalname),
    mimeType: detected.mime,
    size: file.size,
    path: filePath,
  };
};

module.exports = {
  saveProfileImage,
  UPLOAD_DIR,
};