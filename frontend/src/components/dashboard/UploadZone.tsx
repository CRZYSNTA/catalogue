'use client';

import { useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadZoneProps {
  onDrop: (acceptedFiles: File[]) => void;
}

export function UploadZone({ onDrop }: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDropCallback = useCallback((acceptedFiles: File[]) => {
    onDrop(acceptedFiles);
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: onDropCallback,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleCameraClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dropzone from opening
    fileInputRef.current?.click();
  };

  const handleCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onDrop(Array.from(e.target.files));
      // Reset input so the same file can be captured again if needed
      e.target.value = '';
    }
  };

  return (
    <div 
      {...getRootProps()} 
      className={cn(
        "border border-dashed p-16 text-center cursor-pointer transition-colors duration-200 ease-in-out bg-[var(--color-surface)] relative group",
        isDragActive && !isDragReject ? "border-[var(--color-primary)] bg-[var(--color-surface-hover)]" : "border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-hover)]",
        isDragReject && "border-[var(--color-danger)] bg-transparent"
      )}
    >
      <input {...getInputProps()} />
      {/* Hidden input specifically for camera capture */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={fileInputRef} 
        onChange={handleCameraChange} 
        className="hidden" 
      />

      <div className="flex justify-center mb-6">
        <div className={cn(
          "text-[var(--color-primary)]",
          isDragActive && !isDragReject ? "text-[var(--color-primary)]" : "text-[var(--color-muted)] group-hover:text-[var(--color-primary)] transition-colors duration-200"
        )}>
          {isDragActive ? <Upload className="w-6 h-6" strokeWidth={1.5} /> : <ImageIcon className="w-6 h-6" strokeWidth={1.5} />}
        </div>
      </div>
      
      <h3 className="text-sm font-medium tracking-tight text-[var(--color-primary)] mb-3 uppercase">
        {isDragActive ? "Drop the images here..." : "Drag & drop images here"}
      </h3>
      <p className="text-[13px] text-[var(--color-secondary)] font-light mb-8">or click to browse from your computer</p>
      
      <div className="flex justify-center mb-8">
        <button
          type="button"
          onClick={handleCameraClick}
          className="flex items-center gap-2 px-5 py-2.5 border border-[var(--color-border)] rounded-none bg-[var(--color-surface)] hover:bg-[var(--color-background)] hover:border-[var(--color-primary)] text-[var(--color-primary)] text-[12px] font-medium uppercase tracking-wider transition-all duration-200 ease-in-out shadow-sm"
        >
          <Camera className="w-4 h-4" strokeWidth={1.5} />
          Take Photo
        </button>
      </div>

      <div className="text-xs text-[var(--color-muted)]/70 flex justify-center gap-4 uppercase tracking-widest">
        <span>Supports JPG, PNG, WEBP</span>
        <span>•</span>
        <span>Max 10MB</span>
      </div>
    </div>
  );
}
