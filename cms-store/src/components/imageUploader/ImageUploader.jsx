import React, { useState } from "react";
import { toast } from "react-toastify";
import { IoMdAttach } from "react-icons/io";

export default function ImageUploader({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const MAX_SIZE = 2 * 1024 * 1024; // 2MB

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.size > MAX_SIZE) {
      setError("File size must be less than 2MB");
      setFile(null);
      setPreview(null);
      return;
    }

    setError("");
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const uploadFile = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "products_unsigned_preset");

    try {
      setProgress(0);
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dimj5vpdf/image/upload",
        { method: "POST", body: formData }
      );

      const data = await res.json();

      if (!data.secure_url) throw new Error("Upload failed");

      onUploadSuccess(data.secure_url);
      toast.success("Image uploaded successfully!", { position: "bottom-left" });
      setProgress(100);
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed", { position: "bottom-left" });
      setProgress(0);
    }
  };

  return (
    <div className="flex items-center  gap-4 h-full w-full">
      <label
        htmlFor="fileInput"
        className="flex items-center gap-2 cursor-pointer px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 flex-shrink-0"
      >
        <IoMdAttach />
        Select
      </label>
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}

      {preview && (
        <div className="relative h-full w-12 flex-shrink-0 rounded overflow-hidden border">
          <img
            src={preview}
            alt="Preview"
            className="h-full w-full object-cover"
          />
          {progress > 0 && progress < 100 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-10 h-10">
                <circle
                  cx="50%"
                  cy="50%"
                  r="16"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="16"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 16}
                  strokeDashoffset={2 * Math.PI * 16 * (1 - progress / 100)}
                  strokeLinecap="round"
                  transform="rotate(-90 16 16)"
                />
              </svg>
              <span className="absolute text-xs font-medium">{progress}%</span>
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={uploadFile}
        disabled={!file}
        className="px-3 py-1 bg-blue-500 text-white rounded-md flex-shrink-0 disabled:opacity-50"
      >
        Upload
      </button>
    </div>
  );
}
