export const getPublicImageUrl = (imgPath?: string): string => {
  const publicMinioHost = process.env.NEXT_PUBLIC_MINIO_HOST || 'http://localhost:9001';
  if (!imgPath) return '/default-user.png';
  return imgPath.replace('minio:9001', publicMinioHost);
};