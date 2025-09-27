import sharp from "sharp";

export const compressImage = async (
  inputPath: string,
  outputPath: string,
  type: "banner" | "default" = "default"
): Promise<void> => {
  const targetWidth = type === "banner" ? 1920 : 500;
  const targetHeight = type === "banner" ? 1080 : 500;

  await sharp(inputPath)
    .resize(targetWidth, targetHeight, {
      fit: "cover",
    })
    .jpeg({ quality: 80 })
    .toFile(outputPath);

  console.log("✅ Image compressed and saved:", outputPath);
};

export const compressImageBuffer = async (
  buffer: Buffer,
  type: "banner" | "default" = "default"
): Promise<Buffer> => {
  const targetWidth = type === "banner" ? 1920 : 500;
  const targetHeight = type === "banner" ? 1080 : 500;

  return sharp(buffer)
    .resize(targetWidth, targetHeight, { fit: "cover" })
    .jpeg({ quality: 80 })
    .toBuffer();
};
