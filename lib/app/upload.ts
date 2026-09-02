import { apiJson } from './api-client';
import { compressImage, MAX_UPLOAD_BYTES, type UploadPurpose } from './image-compress';
import type { PresignResponse } from './types';

/**
 * Compress, presign, and PUT an image straight to object storage, then hand the
 * storage key back for the caller to attach to a request / offer / profile.
 *
 * The PUT goes browser → S3, bypassing the API, so the bucket's CORS policy must
 * allow PUT from this origin. Mobile uploads natively and never needed that, so
 * it is easy to miss when deploying the web app.
 */
export async function presignAndPut(purpose: UploadPurpose, file: File): Promise<string> {
  const compressed = await compressImage(file, purpose);

  if (compressed.size > MAX_UPLOAD_BYTES) {
    throw new Error('file_too_large');
  }

  const presign = await apiJson<PresignResponse>('/uploads/presign', {
    method: 'POST',
    body: JSON.stringify({
      purpose,
      content_type: compressed.contentType,
      size: compressed.size,
    }),
  });

  const res = await fetch(presign.url, {
    method: presign.method,
    headers: presign.headers as Record<string, string>,
    body: compressed.blob,
  });
  if (!res.ok) {
    throw new Error(`Upload failed: ${res.status}`);
  }

  return presign.storage_key;
}
