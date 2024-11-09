import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "dtpzfr8oc",
  api_key: 651213427892597,
  api_secret: `027XtjuLEdNQBT0auL8_zBJEgN8`
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("No file path provided.");
      return null;
    }

    const response = await cloudinary.uploader
      .upload(localFilePath, {
        resource_type: "auto",
      })
      .catch((err) => {
        console.log("error", err);
      });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (err) {
    fs.unlinkSync(localFilePath);
    console.error("Error uploading file to Cloudinary:", err.message);
    return null;
  }
};

export { uploadOnCloudinary };
