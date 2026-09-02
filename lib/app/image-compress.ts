export type UploadPurpose = 'request_photo' | 'offer_photo' | 'shop_logo';

/** Same limits as mobile/lib/image-compress.ts, so both clients upload comparable files. */
const MAX_DIMENSION: Record<UploadPurpose, number> = {
  shop_logo: 512,
  request_photo: 1600,
  offer_photo: 1600,
};

const QUALITY: Record<UploadPurpose, number> = {
  shop_logo: 0.85,
  request_photo: 0.8,
  offer_photo: 0.8,
};

const SKIP_IF_BELOW_BYTES = 200_000;

/** api/src/uploads/uploads.service.ts rejects anything larger. */
export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

export type CompressedImage = {
  blob: Blob;
  contentType: string;
  size: number;
};

/**
 * Downscale and re-encode a picked file to JPEG via canvas, the browser
 * counterpart of expo-image-manipulator. Small files are passed through
 * untouched, matching mobile's 200 KB skip threshold.
 */
export async function compressImage(
  file: File,
  purpose: UploadPurpose,
): Promise<CompressedImage> {
  if (file.size < SKIP_IF_BELOW_BYTES && file.type.startsWith('image/')) {
    return { blob: file, contentType: file.type, size: file.size };
  }

  const bitmap = await createImageBitmap(file);
  try {
    const maxDim = MAX_DIMENSION[purpose];
    // Only ever shrink — upscaling a small photo would inflate the upload for nothing.
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', QUALITY[purpose]),
    );
    if (!blob) throw new Error('Image encoding failed');

    return { blob, contentType: 'image/jpeg', size: blob.size };
  } finally {
    bitmap.close();
  }
}
