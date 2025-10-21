const BLOB_BASE =
  process.env.NEXT_PUBLIC_BLOB_URL ||
  "https://mghzzpn2s9ixrl0b.public.blob.vercel-storage.com";

export function getImageUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  if (process.env.NODE_ENV === "production") {
    return `${BLOB_BASE}/product/${cleanPath}`;
  }

  return `/${cleanPath}`;
}

export function getImageProps(
  src: string,
  alt: string,
  width: number,
  height: number
) {
  return {
    src: getImageUrl(src),
    alt,
    width,
    height,
  };
}
