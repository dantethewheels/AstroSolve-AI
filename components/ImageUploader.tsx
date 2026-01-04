
import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon, XCircleIcon } from './icons';

interface ImageUploaderProps {
  onImageSelect: (file: File | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageSelect(file);
    } else {
      setPreviewUrl(null);
      onImageSelect(null);
      if (file) {
        alert("Please select a valid image file.");
      }
    }
  }, [onImageSelect]);

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onImageSelect(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-white/5 p-4 rounded-lg border border-dashed border-white/20 transition-all duration-300">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png, image/jpeg, image/webp"
        onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
        className="hidden"
      />
      {previewUrl ? (
        <div className="relative group">
          <img src={previewUrl} alt="Astro image preview" className="w-full h-auto max-h-[60vh] object-contain rounded-md" />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-red-500/80 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Remove image"
          >
            <XCircleIcon className="w-8 h-8" />
          </button>
        </div>
      ) : (
        <div
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center p-10 cursor-pointer rounded-md transition-colors duration-300 ${isDragging ? 'bg-indigo-500/20' : 'bg-transparent'}`}
        >
          <UploadIcon className="w-16 h-16 text-gray-500 mb-4" />
          <p className="text-lg font-semibold text-gray-300">Drop your astro image here</p>
          <p className="text-gray-400">or click to browse</p>
        </div>
      )}
    </div>
  );
};
