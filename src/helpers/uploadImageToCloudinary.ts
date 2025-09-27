import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import "dotenv/config";

config({ path: "./.env.local" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const allowedImageTypes = ["image/png", "image/jpeg", "image/jpg"];

const uploadImageToCloudinary = async (
  image: Express.Multer.File,
  folderName: string
): Promise<{ imageUrl: string; publicId: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `e-commerce/${folderName}`,
        width: 500,
        height: 500,
        crop: "fill",
        quality: "auto:eco",
        format: "webp",
      },
      (error, result) => {
        if (error || !result) {
          return reject(
            new Error(`Cloudinary upload failed: ${error?.message}`)
          );
        }

        resolve({
          imageUrl: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    stream.end(image.buffer);
  });
};

const uploadBannerToCloudinary = async (
  image: Express.Multer.File,
  folderName: string
) => {
  const b64 = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${b64}`;

  const uploadResult = await cloudinary.uploader.upload(dataURI, {
    folder: `e-commerce/${folderName}`,
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
  image: Express.Multer.File,
  folderName: string,
  publicId?: string
): Promise<{ imageUrl: string; publicId: string }> => {
  try {
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err: any) {
        throw new Error(`Failed to delete old image: ${err.message}`);
      }
    }

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `e-commerce/${folderName}`,
          width: 500,
          height: 500,
          crop: "fill",
          gravity: "faces",
          use_filename: true,
          unique_filename: false,
          quality: "auto:eco",
          format: "webp",
        },
        (error, result) => {
          if (error || !result) {
            return reject(
              new Error(`Cloudinary update failed: ${error?.message}`)
            );
          }

          resolve({
            imageUrl: result.secure_url,
            publicId: result.public_id,
          });
        }
      );

      stream.end(image.buffer);
    });
  } catch (error: any) {
    throw new Error(`updateImageInCloudinary failed: ${error.message}`);
  }
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
