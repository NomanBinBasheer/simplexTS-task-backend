import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUdinARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true 
  });

const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) {
      throw new ApiError(400, "File path is required");
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    return response;
  } catch (error) {
    console.log(error);
    fs.unlinkSync(localFilePath); // Remove the locally saved file as the upload failed
    throw new ApiError(500, "Internal Server Error");
  }
};

export { uploadOnCloudinary };
