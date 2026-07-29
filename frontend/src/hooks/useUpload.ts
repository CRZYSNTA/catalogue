'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { api } from '@/services/api';
import type { UploadFileItem } from '@/types/product';
import { get, set } from 'idb-keyval';

export function useUpload() {
  const [files, setFiles] = useState<UploadFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const isLoaded = useRef(false);

  useEffect(() => {
    get<UploadFileItem[]>('uploadQueue').then((val) => {
      if (val && val.length > 0) {
        // Regenerate object URLs since they expire on page reload
        const restored = val.map((item) => ({
          ...item,
          preview: URL.createObjectURL(item.file)
        }));
        setFiles(restored);
      }
      isLoaded.current = true;
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (isLoaded.current) {
      set('uploadQueue', files).catch(console.error);
    }
  }, [files]);

  const addFiles = useCallback((newFiles: File[]) => {
    const items: UploadFileItem[] = newFiles.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview: URL.createObjectURL(file),
      status: 'idle' as const,
      progress: 0,
    }));
    setFiles((prev) => [...prev, ...items]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) URL.revokeObjectURL(file.preview);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const updateFile = useCallback((id: string, updates: Partial<UploadFileItem>) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  }, []);

  const uploadAndAnalyze = useCallback(async () => {
    setIsProcessing(true);
    const pendingFiles = files.filter((f) => f.status === 'idle');

    for (const item of pendingFiles) {
      try {
        // Upload
        updateFile(item.id, { status: 'uploading', progress: 30 });
        const uploadRes = await api.uploadImage(item.file);
        updateFile(item.id, { status: 'uploading', progress: 60, imageUrl: uploadRes.image_url });

        // Analyze
        updateFile(item.id, { status: 'analyzing', progress: 80 });
        const product = await api.analyzeImage(uploadRes.image_url);
        updateFile(item.id, { status: 'complete', progress: 100, product });
      } catch (err: any) {
        updateFile(item.id, { status: 'error', error: err.message || 'Failed' });
      }
    }
    setIsProcessing(false);
  }, [files, updateFile]);

  const clearCompleted = useCallback(() => {
    setFiles((prev) => {
      prev.filter((f) => f.status === 'complete').forEach((f) => URL.revokeObjectURL(f.preview));
      return prev.filter((f) => f.status !== 'complete');
    });
  }, []);

  const clearAll = useCallback(() => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
  }, [files]);

  return {
    files,
    isProcessing,
    addFiles,
    removeFile,
    uploadAndAnalyze,
    clearCompleted,
    clearAll,
  };
}
