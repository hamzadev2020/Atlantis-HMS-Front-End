const CLOUD_NAME = "lmo3yiw1";
const UPLOAD_PRESET = "ml_default";
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export const uploadImage = async (file) => {
  if (!(file instanceof File) || !file.type.startsWith("image/")) {
    throw new Error("Choose a valid image file.");
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Images must be 10 MB or smaller.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });
  const result = await response.json();
  if (!response.ok || !result.secure_url) {
    throw new Error(result.error?.message || "Image upload failed. Check the unsigned Cloudinary upload preset.");
  }
  return result.secure_url;
};
