"use client";

import { useRef, useState, useTransition } from "react";

import { uploadProfileAvatar } from "@/lib/profile/actions";
import { cn } from "@/lib/utils";

import { getProfileInitials, ProfileAvatar } from "./profile-avatar";

type ProfileAvatarUploadProps = {
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
};

export function ProfileAvatarUpload({
  name,
  email,
  avatarUrl,
}: ProfileAvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(avatarUrl);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSelect() {
    inputRef.current?.click();
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5 MB or smaller.");
      return;
    }

    setError(null);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    const formData = new FormData();
    formData.set("avatar", file);

    startTransition(async () => {
      const result = await uploadProfileAvatar(formData);

      if (result.error) {
        setError(result.error);
        setPreviewUrl(avatarUrl);
        return;
      }

      if (result.avatarUrl) {
        setPreviewUrl(result.avatarUrl);
      }
    });
  }

  const initials = getProfileInitials(name, email);

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={handleSelect}
        disabled={isPending}
        className={cn(
          "group relative overflow-hidden rounded-2xl border border-green-sage/30 shadow-soft transition-all duration-200",
          "hover:border-green-sage/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-deep/30",
          isPending && "opacity-70",
        )}
        aria-label="Upload profile photo"
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt={name ? `${name} profile photo` : "Profile photo"}
            className="h-20 w-20 object-cover sm:h-24 sm:w-24"
          />
        ) : (
          <ProfileAvatar
            name={name}
            email={email}
            className="h-20 w-20 sm:h-24 sm:w-24"
          />
        )}

        <span className="absolute inset-x-0 bottom-0 bg-green-deep/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white opacity-0 transition-opacity group-hover:opacity-100">
          {isPending ? "Uploading..." : "Change"}
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={handleChange}
      />

      {!previewUrl ? (
        <span className="sr-only">{initials}</span>
      ) : null}

      {error ? (
        <p className="absolute left-0 top-full mt-2 w-44 text-xs text-red-500">
          {error}
        </p>
      ) : null}
    </div>
  );
}
