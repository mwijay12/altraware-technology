"use client";

import React, { useState, useId } from "react";
import { uploadFileToCloudinary } from "@/lib/cloudinary";

interface CloudinaryUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  compact?: boolean;
}

export default function CloudinaryUploader({
  value,
  onChange,
  label = "Browse File to upload",
  compact = false,
}: CloudinaryUploaderProps) {
  const inputId = useId();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);
    try {
      const url = await uploadFileToCloudinary(file);
      onChange(url);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <label
          htmlFor={inputId}
          className="cursor-pointer inline-flex items-center gap-2 bg-viol hover:bg-violD text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md shadow-viol/20 shrink-0"
        >
          {loading ? (
            <>
              <i className="fa-solid fa-spinner fa-spin text-xs" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <i className="fa-solid fa-cloud-arrow-up text-xs" />
              <span>{fileName ? "Change (PC/Mobile)" : "Choose Photo (PC)"}</span>
            </>
          )}
          <input
            id={inputId}
            type="file"
            accept="image/*"
            disabled={loading}
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        {value && (
          <span className="text-[11px] font-mono text-white/50 truncate max-w-[200px]" title={value}>
            {value.slice(-25)}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full max-w-sm rounded-2xl bg-white/[0.04] border border-white/15 p-4 shadow-xl flex flex-col gap-3">
        {/* Drop / Browse area */}
        <label
          htmlFor={inputId}
          className={`cursor-pointer rounded-xl border-2 border-dashed border-viol/40 hover:border-viol bg-viol/5 hover:bg-viol/10 p-6 flex flex-col items-center justify-center text-center transition-all ${
            loading ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          {value ? (
            <div className="relative w-full h-32 rounded-lg overflow-hidden border border-white/10 mb-2 bg-black/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white text-xs font-bold">
                Click to change
              </div>
            </div>
          ) : (
            <svg
              className="w-14 h-14 text-viol mb-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          <p className="text-xs font-bold text-white/90">{label}</p>
          <p className="text-[10px] text-white/40 mt-1">PNG, JPG or WebP to Cloudinary</p>
        </label>

        {/* Footer bar */}
        <label
          htmlFor={inputId}
          className="cursor-pointer bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 rounded-xl px-3 py-2 flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-2 min-w-0">
            <i className="fa-solid fa-file-image text-viol text-sm shrink-0" />
            <span className="text-xs font-medium text-white/70 truncate">
              {loading ? "Uploading..." : fileName || (value ? "Photo selected" : "No file selected")}
            </span>
          </div>
          <span className="text-[10px] bg-viol text-white font-bold px-2.5 py-1 rounded-lg shrink-0">
            {loading ? "..." : "Browse (PC)"}
          </span>
        </label>

        <input
          id={inputId}
          type="file"
          accept="image/*"
          disabled={loading}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
