'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadZoneProps {
  onDrop: (acceptedFiles: File[]) => void;
}

export function UploadZone({ onDrop }: UploadZoneProps) {
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

  return (
    <div 
      {...getRootProps()} 
      className={cn(
        "border-2 border-dashed rounded-[var(--radius-xl)] p-12 text-center cursor-pointer transition-colors duration-200 ease-in-out bg-[var(--color-surface)]",
        isDragActive && !isDragReject ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5" : "border-[var(--color-border)] hover:border-[var(--color-muted)] hover:bg-[var(--color-surface-hover)]",
        isDragReject && "border-[var(--color-error)] bg-[var(--color-error)]/5"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex justify-center mb-4">
        <div className={cn(
          "p-4 rounded-full",
          isDragActive && !isDragReject ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-surface-hover)] text-[var(--color-muted)]"
        )}>
          {isDragActive ? <Upload className="w-8 h-8" /> : <ImageIcon className="w-8 h-8" />}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
        {isDragActive ? "Drop the images here..." : "Drag & drop images here"}
      </h3>
      <p className="text-[var(--color-muted)] mb-4">or click to browse from your computer</p>
      <div className="text-xs text-[var(--color-muted)]/70 flex justify-center gap-4">
        <span>Supports JPG, PNG, WEBP</span>
        <span>•</span>
        <span>Max 10MB per file</span>
      </div>
    </div>
  );
}
