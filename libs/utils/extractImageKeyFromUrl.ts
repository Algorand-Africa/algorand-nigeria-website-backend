export function extractImageKeyFromUrl(imageUrl: string) {
  const imageKey = imageUrl.split('.com').pop();
  return imageKey;
}
