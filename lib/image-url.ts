/**
 * Get the correct image URL based on environment
 * In production, images are served from Vercel Blob
 * In development, images are served locally
 */
export function getImageUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path

  // In production, use the Blob URL
  if (process.env.NODE_ENV === "production") {
    // Images are uploaded to blob with 'product/' prefix
    return `https://blob.vercel-storage.com/product/${cleanPath}`
  }

  // In development, use local files
  return `/${cleanPath}`
}

/**
 * Helper to get image props for Next.js Image component
 */
export function getImageProps(src: string, alt: string, width: number, height: number) {
  return {
    src: getImageUrl(src),
    alt,
    width,
    height,
  }
}
