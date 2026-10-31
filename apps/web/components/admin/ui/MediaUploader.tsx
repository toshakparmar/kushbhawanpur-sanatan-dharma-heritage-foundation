"use client";

import * as React from "react";
import {
  Upload,
  Image as ImageIcon,
  X,
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Undo2,
  Crop as CropIcon,
} from "lucide-react";
import Cropper from "react-easy-crop";
import { ConfirmDialog } from "./ConfirmDialog";

export interface MediaUploadResult {
  url: string;
  key?: string;
  size?: number;
  mimeType?: string;
}

interface MediaUploaderProps {
  value?: string | null;
  onChange?: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  helperText?: string;
  accept?: string;
  maxSizeMB?: number;
  aspectRatio?: number; // e.g. 1 for square, 4/5 for portrait, 16/9
  allowCrop?: boolean;
  className?: string;
  id?: string;
}

export function MediaUploader({
  value,
  onChange,
  onRemove,
  label = "Upload Image",
  helperText = "PNG, JPG, WEBP up to 5 MB. Drag & drop or paste from clipboard.",
  accept = "image/jpeg,image/png,image/webp,image/svg+xml",
  maxSizeMB = 5,
  aspectRatio,
  allowCrop = true,
  className = "",
  id,
}: MediaUploaderProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<number>(0);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Replace & Undo state
  const [previousValue, setPreviousValue] = React.useState<string | null>(null);
  const [tempPreviewUrl, setTempPreviewUrl] = React.useState<string | null>(null);

  // Remove confirmation modal
  const [confirmRemoveOpen, setConfirmRemoveOpen] = React.useState(false);

  // Lightbox preview
  const [lightboxOpen, setLightboxOpen] = React.useState(false);

  // Crop modal state
  const [cropModalOpen, setCropModalOpen] = React.useState(false);
  const [imageToCrop, setImageToCrop] = React.useState<string | null>(null);
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<any>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const dropzoneRef = React.useRef<HTMLDivElement>(null);

  // Clipboard paste listener
  React.useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!dropzoneRef.current) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleFileSelect(file);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const validateFile = (file: File): boolean => {
    setErrorMessage(null);
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      setErrorMessage(`This file is ${sizeMB.toFixed(1)} MB — maximum allowed is ${maxSizeMB} MB.`);
      return false;
    }

    const acceptedTypes = accept.split(",").map((t) => t.trim().toLowerCase());
    const fileType = file.type.toLowerCase();
    const isAccepted = acceptedTypes.some((type) => {
      if (type.endsWith("/*")) {
        const prefix = type.replace("/*", "");
        return fileType.startsWith(prefix);
      }
      return type === fileType;
    });

    if (!isAccepted) {
      setErrorMessage(`Invalid file format (${file.type}). Allowed: ${accept}`);
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (!validateFile(file)) return;

    if (allowCrop && file.type.startsWith("image/") && !file.type.includes("svg")) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result as string);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    } else {
      uploadFile(file);
    }
  };

  const uploadFile = async (file: File | Blob, filename: string = "uploaded-image.jpg") => {
    setIsUploading(true);
    setUploadProgress(10);
    setErrorMessage(null);

    // Track previous value for Undo
    if (value && !previousValue) {
      setPreviousValue(value);
    }

    // Set instant local preview
    const objectUrl = URL.createObjectURL(file);
    setTempPreviewUrl(objectUrl);

    try {
      const formData = new FormData();
      formData.append("file", file, filename);

      setUploadProgress(30);

      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      setUploadProgress(80);

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || json.message || "Failed to upload file");
      }

      const uploadedUrl = json.data?.url || json.url;
      setUploadProgress(100);

      setTimeout(() => {
        setIsUploading(false);
        setTempPreviewUrl(null);
        onChange?.(uploadedUrl);
      }, 300);
    } catch (err: any) {
      setIsUploading(false);
      setTempPreviewUrl(null);
      setErrorMessage(err.message || "Upload failed. Please try again.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUndoReplace = () => {
    if (previousValue) {
      onChange?.(previousValue);
      setPreviousValue(null);
    }
  };

  const handleConfirmRemove = () => {
    setPreviousValue(null);
    setTempPreviewUrl(null);
    onRemove?.();
    onChange?.("");
  };

  // Canvas crop execution
  const createCroppedImage = async (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!imageToCrop || !croppedAreaPixels) return reject(new Error("No image data"));

      const image = new window.Image();
      image.src = imageToCrop;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        const ctx = canvas.getContext("2d");

        if (!ctx) return reject(new Error("Could not get canvas context"));

        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
        );

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Canvas blob creation failed"));
          },
          "image/jpeg",
          0.92,
        );
      };
      image.onerror = (err) => reject(err);
    });
  };

  const handleCropComplete = async () => {
    try {
      setCropModalOpen(false);
      const croppedBlob = await createCroppedImage();
      uploadFile(croppedBlob, "cropped-image.jpg");
    } catch (err: any) {
      setErrorMessage("Crop processing failed: " + err.message);
    }
  };

  const currentDisplayUrl = tempPreviewUrl || value;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="text-xs font-semibold text-ink">
            {label}
          </label>
          {previousValue && (
            <button
              type="button"
              onClick={handleUndoReplace}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-saffron-deep hover:text-saffron transition-colors"
            >
              <Undo2 className="h-3 w-3" />
              Undo Replace
            </button>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        id={id}
        accept={accept}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
          }
        }}
      />

      {/* Active Preview Card */}
      {currentDisplayUrl ? (
        <div className="relative rounded-2xl border border-sand bg-paper p-3 shadow-xs transition-all">
          <div className="flex items-center gap-3.5">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-sand bg-sand/20">
              <img
                src={currentDisplayUrl}
                alt="Uploaded media preview"
                className="h-full w-full object-cover"
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-2xs">
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
                <CheckCircle2 className="h-3.5 w-3.5 text-banyan" />
                <span className="truncate">Media Attached</span>
              </div>
              <p className="mt-0.5 text-[11px] text-ink/60 truncate">
                {currentDisplayUrl.startsWith("http")
                  ? currentDisplayUrl.replace(/^https?:\/\/[^/]+/, "")
                  : "Local preview"}
              </p>

              {/* Progress bar during upload */}
              {isUploading && (
                <div className="mt-2 w-full">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-sand">
                    <div
                      className="h-full bg-saffron transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-ink/60 mt-0.5 block">
                    Uploading... {uploadProgress}%
                  </span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                title="View full-size"
                className="rounded-lg p-1.5 text-ink/60 hover:bg-sand/60 hover:text-ink transition-colors"
              >
                <Eye className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                title="Replace image"
                className="inline-flex items-center gap-1 rounded-lg border border-sand bg-white px-2.5 py-1 text-xs font-medium text-ink hover:bg-sand/40 transition-colors disabled:opacity-50"
              >
                <RefreshCw className="h-3 w-3" />
                Replace
              </button>

              <button
                type="button"
                onClick={() => setConfirmRemoveOpen(true)}
                disabled={isUploading}
                title="Remove image"
                className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Drag & Drop Zone */
        <div
          ref={dropzoneRef}
          tabIndex={0}
          role="button"
          aria-label="Upload file dropzone. Press Enter or Space to choose a file."
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-gold/30 ${
            isDragging
              ? "border-saffron bg-saffron/5 scale-[1.01]"
              : "border-sand/90 bg-paper/60 hover:border-gold/60 hover:bg-paper"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sand/60 text-saffron-deep shadow-2xs mb-2.5">
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-saffron" />
            ) : (
              <Upload className="h-6 w-6" />
            )}
          </div>

          <p className="text-xs font-semibold text-ink">
            <span className="text-saffron-deep underline underline-offset-2">Click to browse</span> or drag & drop image
          </p>
          <p className="mt-1 text-[11px] text-ink/60">{helperText}</p>
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="flex items-center gap-1.5 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Remove Confirmation Modal */}
      <ConfirmDialog
        open={confirmRemoveOpen}
        onOpenChange={setConfirmRemoveOpen}
        title="Remove Attached Image?"
        description="Are you sure you want to remove this image? You can upload a new image or undo anytime before saving."
        confirmLabel="Remove Image"
        onConfirm={handleConfirmRemove}
      />

      {/* Full-size Lightbox Modal */}
      {lightboxOpen && currentDisplayUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl">
            <img
              src={currentDisplayUrl}
              alt="Full view"
              className="max-h-[85vh] w-auto rounded-2xl object-contain bg-paper"
            />
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute top-3 right-3 rounded-full bg-black/60 p-2 text-white hover:bg-black transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Crop Modal */}
      {cropModalOpen && imageToCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative w-full max-w-xl rounded-2xl bg-paper p-5 shadow-2xl border border-sand">
            <div className="flex items-center justify-between pb-3 border-b border-sand">
              <h3 className="font-serif font-bold text-base text-ink flex items-center gap-2">
                <CropIcon className="h-4 w-4 text-saffron" />
                Crop Image
              </h3>
              <button
                type="button"
                onClick={() => setCropModalOpen(false)}
                className="text-ink/60 hover:text-ink p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative h-72 w-full mt-3 bg-black/90 rounded-xl overflow-hidden">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio || 4 / 5}
                onCropChange={setCrop}
                onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
                onZoomChange={setZoom}
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-4">
              <div className="flex-1 flex items-center gap-2">
                <span className="text-[11px] text-ink/60">Zoom</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-saffron"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCropModalOpen(false)}
                  className="rounded-xl border border-sand bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-sand/30"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCropComplete}
                  className="rounded-xl bg-maroon px-4 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-maroon-deep transition-colors"
                >
                  Apply & Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
