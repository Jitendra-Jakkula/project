const express = require( "express");
const upload  = require("../middleware/uploadMiddleware.js");
const cloudinary = require("../config/cloudinary.js");

const router = express.Router();

router.post(
  "/image",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image uploaded",
        });
      }

      const result = await new Promise(
        (resolve, reject) => {
          const uploadStream =
            cloudinary.uploader.upload_stream(
              {
                folder: "problem-notebook",
                resource_type: "image",
              },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );

          uploadStream.end(req.file.buffer);
        }
      );

      return res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        image: {
          url: result.secure_url,
          publicId: result.public_id,
        },
      });
    } catch (error) {
      console.error(
        "Cloudinary upload error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Image upload failed",
      });
    }
  }
);

const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({
        message: "Image publicId is required.",
      });
    }

    await cloudinary.uploader.destroy(publicId);

    return res.status(200).json({
      message: "Image deleted successfully.",
    });
  } catch (error) {
    console.error("Cloudinary delete failed:", error);

    return res.status(500).json({
      message: "Failed to delete image.",
    });
  }
};
router.delete("/image",deleteImage);
module.exports =router;