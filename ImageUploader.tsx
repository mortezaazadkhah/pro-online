
import React, { useState, useRef, useCallback } from 'react';
import type { ImageState } from '../types';
import { UploadIcon, XCircleIcon } from './IconComponents';

interface ImageUploaderProps {
  id: string;
  title: string;
  onImageSelect: (state: ImageState) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, title, onImageSelect }) => {
  const [image, setImage] = useState<ImageState>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = useCallback(async (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      const base64 = await fileToBase64(file);
      const newState = { base64, name: file.name, mimeType: file.type };
      setImage(newState);
      onImageSelect(newState);
    }
  }, [onImageSelect]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImage(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div 
      className={`relative group bg-gray-800/50 border-2 border-dashed rounded-xl p-4 transition-all duration-300 h-80 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-500 hover:bg-gray-800/70 ${isDragging ? 'border-indigo-400 bg-indigo-900/50' : 'border-gray-600'}`}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id={id}
        ref={fileInputRef}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        onChange={(e) => handleFileChange(e.target.files)}
      />
      {image ? (
        <>
          <img src={`data:${image.mimeType};base64,${image.base64}`} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
          <button 
            onClick={clearImage} 
            className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-rose-600 transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Remove image"
          >
            <XCircleIcon className="w-6 h-6" />
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-400">
          <UploadIcon className="w-12 h-12 mb-4 transition-transform duration-300 group-hover:scale-110" />
          <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
          <p>فایل را بکشید و رها کنید یا کلیک کنید</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
