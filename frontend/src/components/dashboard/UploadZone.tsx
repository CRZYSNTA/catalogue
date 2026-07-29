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
        "border border-dashed p-16 text-center cursor-pointer transition-colors duration-200 ease-in-out bg-[var(--color-surface)]",
        isDragActive && !isDragReject ? "border-[var(--color-primary)] bg-[var(--color-surface-hover)]" : "border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-hover)]",
        isDragReject && "border-[var(--color-danger)] bg-transparent"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex justify-center mb-6">
        <div className={cn(
          "text-[var(--color-primary)]",
          isDragActive && !isDragReject ? "text-[var(--color-primary)]" : "text-[var(--color-muted)]"
        )}>
          {isDragActive ? <Upload className="w-6 h-6" strokeWidth={1.5} /> : <ImageIcon className="w-6 h-6" strokeWidth={1.5} />}
        </div>
      </div>
      <h3 className="text-sm font-medium tracking-tight text-[var(--color-primary)] mb-3 uppercase">
        {isDragActive ? "Drop the images here..." : "Drag & drop images here"}
      </h3>
      <p className="text-[13px] text-[var(--color-secondary)] font-light mb-6">or click to browse from your computer</p>
      <div className="text-xs text-[var(--color-muted)]/70 flex justify-center gap-4">
        <span>Supports JPG, PNG, WEBP</span>
        <span>•</span>
        <span>Max 10MB per file</span>
      </div>
    </div>
  );
}
