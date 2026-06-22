function trim(value: string | undefined): string | undefined {
  const next = value?.trim();
  return next ? next : undefined;
}

export const cloudinaryConfig = {
  cloudName: trim(process.env.CLOUDINARY_CLOUD_NAME),
  apiKey: trim(process.env.CLOUDINARY_API_KEY),
  apiSecret: trim(process.env.CLOUDINARY_API_SECRET),
  folderPrefix: trim(process.env.CLOUDINARY_FOLDER_PREFIX) ?? "businessos",
};

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    cloudinaryConfig.cloudName &&
      cloudinaryConfig.apiKey &&
      cloudinaryConfig.apiSecret,
  );
}
