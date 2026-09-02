"use client";

import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/app/ui/button";
import type { UploadPurpose } from "@/lib/app/image-compress";
import { presignAndPut } from "@/lib/app/upload";

export type PickedPhoto = { storageKey: string; previewUrl: string };

/**
 * Browser counterpart of the expo-image-picker flow: choose files, compress on a
 * canvas, PUT each to storage via a presigned URL, and keep the returned storage
 * keys for the domain request. Uploading eagerly (rather than on submit) means a
 * slow connection blocks the picker, not the Publish button.
 */
export function PhotoPicker({
  purpose,
  photos,
  onChange,
  max = 8,
}: {
  purpose: UploadPurpose;
  photos: PickedPhoto[];
  onChange: (photos: PickedPhoto[]) => void;
  max?: number;
}) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    const room = max - photos.length;
    const chosen = Array.from(files).slice(0, room);
    const added: PickedPhoto[] = [];
    try {
      for (const file of chosen) {
        const storageKey = await presignAndPut(purpose, file);
        added.push({ storageKey, previewUrl: URL.createObjectURL(file) });
      }
      onChange([...photos, ...added]);
    } catch (e) {
      // Keep whatever did upload; only the failed tail is lost.
      if (added.length > 0) onChange([...photos, ...added]);
      setError(
        e instanceof Error && e.message === "file_too_large"
          ? t("web.fileTooLarge")
          : t("web.uploadFailed"),
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(index: number) {
    const photo = photos[index];
    URL.revokeObjectURL(photo.previewUrl);
    onChange(photos.filter((_, i) => i !== index));
  }

  return (
    <div>
      {photos.length > 0 ? (
        <ul className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {photos.map((photo, i) => (
            <li key={photo.storageKey} className="relative">
              <span className="block aspect-square overflow-hidden rounded-lg bg-surface-container-high">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.previewUrl} alt="" className="h-full w-full object-cover" />
              </span>
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={t("web.removePhoto")}
                className="absolute -right-2 -top-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-inverse-surface text-white shadow"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={max > 1}
        className="sr-only"
        onChange={(e) => void onFiles(e.target.files)}
      />
      <Button
        type="button"
        variant="secondary"
        size="sm"
        loading={uploading}
        disabled={photos.length >= max}
        onClick={() => inputRef.current?.click()}
        icon={<span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>}
      >
        {uploading ? t("web.uploading") : t("web.chooseFiles")}
      </Button>

      {error ? <p className="mt-2 text-xs text-error">{error}</p> : null}
    </div>
  );
}
