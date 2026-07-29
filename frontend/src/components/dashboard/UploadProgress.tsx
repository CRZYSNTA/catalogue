'use client';

import { X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export type UploadStatus = 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';

export interface FileItem {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: UploadStatus;
  error?: string;
}

interface UploadProgressProps {
  files: FileItem[];
  onRemove: (id: string) => void;
}

export function UploadProgress({ files, onRemove }: UploadProgressProps) {
  if (files.length === 0) return null;

  return (
    <div className="mt-8 space-y-3">
      <h4 className="font-medium text-[var(--color-primary)]">Upload Queue ({files.length})</h4>
      <AnimatePresence>
        {files.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 flex items-center gap-4 overflow-hidden"
          >
            <div className="w-12 h-12 rounded-[var(--radius-md)] overflow-hidden shrink-0 bg-[var(--color-background)]">
              <img src={item.preview} alt="preview" className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium text-[var(--color-primary)] truncate pr-4">
                  {item.file.name}
                </p>
                <div className="flex items-center gap-2">
                  <StatusIcon status={item.status} />
                  <span className="text-xs font-medium text-[var(--color-muted)] capitalize w-20 text-right">
                    {item.status}
                  </span>
                </div>
              </div>
              
              <div className="h-1.5 w-full bg-[var(--color-surface-hover)] rounded-full overflow-hidden">
                <motion.div 
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    item.status === 'error' ? 'bg-[var(--color-error)]' : 
                    item.status === 'complete' ? 'bg-[var(--color-success)]' : 
                    'bg-[var(--color-accent)]'
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.progress}%` }}
                />
              </div>
              
              {item.error && (
                <p className="text-xs text-[var(--color-error)] mt-1">{item.error}</p>
              )}
            </div>
            
            <button
              onClick={() => onRemove(item.id)}
              className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10 rounded-[var(--radius-md)] transition-colors shrink-0"
              disabled={item.status === 'uploading' || item.status === 'analyzing'}
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function StatusIcon({ status }: { status: UploadStatus }) {
  switch (status) {
    case 'complete': return <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />;
    case 'error': return <AlertCircle className="w-4 h-4 text-[var(--color-error)]" />;
    case 'uploading': 
    case 'analyzing': return <Loader2 className="w-4 h-4 text-[var(--color-accent)] animate-spin" />;
    default: return null;
  }
}
