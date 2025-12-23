import crypto from "crypto";

export const getCloudinarySignature = (req, res) => {
  const timestamp = Math.round(Date.now() / 1000);


  const folder = req.query.folder || "fruvvy_images";

  const signature = crypto
    .createHash("sha1")
    .update(
      `folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`
    )
    .digest("hex");

  res.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    timestamp,
    signature,
    folder,
  });
};
