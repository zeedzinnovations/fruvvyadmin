const API_BASE_URL = import.meta.env.VITE_API_URL;

export const uploadToCloudinary = async (file, folder) => {
  try {
    const fullFolder = `fruvvy_images/${folder}`;

    const sigRes = await fetch(
      `${API_BASE_URL}/api/cloudinary-signature?folder=${encodeURIComponent(
        fullFolder
      )}`
    );

    const sig = await sigRes.json();
    if (!sig.signature) throw new Error("Signature missing");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", sig.apiKey);
    formData.append("timestamp", sig.timestamp);
    formData.append("signature", sig.signature);
    formData.append("folder", fullFolder);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
      { method: "POST", body: formData }
    );

    const data = await uploadRes.json();
    return data.secure_url;
  } catch (err) {
    console.error(err);
    return "";
  }
};

