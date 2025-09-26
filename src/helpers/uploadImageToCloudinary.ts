import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import "dotenv/config";

config({ path: "../../.env.local" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const allowedImageTypes = ["image/png", "image/jpeg", "image/jpg"];

const uploadImageToCloudinary = async (
  image: Express.Multer.File,
  userName: string,
  folderName: string
) => {
  try {
    if (!image.buffer) throw new Error("No file buffer found");

    const b64 = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${b64}`;

    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder: `blogPlatform/userImages/${userName}/${folderName}`,
      width: 500,
      height: 500,
      crop: "fill",
      quality: "auto:best",
      format: "webp",
    });

    return {
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    };
  } catch (error: any) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

const uploadBannerToCloudinary = async (
  image: Express.Multer.File,
  userName: any,
  folderName: string
) => {
  const b64 = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${b64}`;

  const uploadResult = await cloudinary.uploader.upload(dataURI, {
    folder: `blogPlatform/userImages/${userName}/${folderName}`,
    width: 1920,
    height: 1080,
    crop: "fill",
    gravity: "center",
    use_filename: true,
    unique_filename: false,
    quality: "100",
    format: "webp",
    timeout: 60000,
  });

  return {
    imageUrl: uploadResult.secure_url,
    publicId: uploadResult.public_id,
  };
};

const updateImageInCloudinary = async (
  image: File,
  userName: any,
  folderName: string,
  publicId: string
) => {
  if (!allowedImageTypes.includes(image.type)) {
    new Error("Invalid image format. Allowed formats: PNG, JPEG, JPG");
  }

  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      new Error("Failed to delete old image from Cloudinary.");
    }
  }

  const buffer = Buffer.from(await image.arrayBuffer());

  const uploadResult = await cloudinary.uploader.upload(
    `data:${image.type};base64,${buffer.toString("base64")}`,
    {
      folder: `portfolio/userImages/${userName}/${folderName}`,
      width: 500,
      height: 500,
      crop: "fill",
      gravity: "faces",
      use_filename: true,
      unique_filename: false,
      quality: "100",
      format: "webp",
    }
  );

  if (!uploadResult || !uploadResult.secure_url || !uploadResult.public_id) {
    new Error("Failed to upload image to Cloudinary.");
  }

  return {
    imageUrl: uploadResult.secure_url,
    publicId: uploadResult.public_id,
  };
};

const deleteImageFromCloudinary = async (publicId: string) => {
  await cloudinary.uploader.destroy(publicId);
};

export {
  uploadImageToCloudinary,
  uploadBannerToCloudinary,
  deleteImageFromCloudinary,
  updateImageInCloudinary,
};
