"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, CheckCircle2, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { UploadZone } from "@/components/dashboard/UploadZone";
import { UploadProgress, type FileItem } from "@/components/dashboard/UploadProgress";
import { useUpload } from "@/hooks/useUpload";

export default function UploadPage() {
  const router = useRouter();
  const { 
    files, 
    isProcessing, 
    addFiles, 
    removeFile, 
    uploadAndAnalyze, 
    clearCompleted, 
    clearAll 
  } = useUpload();

  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    if (files.length > 0 && files.every(f => f.status === 'complete')) {
      if (!allDone) {
        setAllDone(true);
        toast.success("All products analyzed successfully!");
      }
    } else {
      setAllDone(false);
    }
  }, [files, allDone]);

  const handleStartAnalysis = async () => {
    if (files.filter(f => f.status === 'idle' || f.status === 'error').length === 0) {
      toast.info("No pending files to analyze");
      return;
    }
    
    try {
      await uploadAndAnalyze();
    } catch (error) {
      console.error("Analysis failed:", error);
      toast.error("Some files failed to analyze. Please check the list.");
    }
  };

  const pendingCount = files.filter(f => f.status === 'idle' || f.status === 'error').length;
  const completedCount = files.filter(f => f.status === 'complete').length;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Upload Product Images</h1>
        <p className="text-[var(--color-muted)] mt-2">
          Upload images of your products. Our AI will automatically extract details and generate catalogue entries.
        </p>
      </div>

      <div className="space-y-8">
        <UploadZone onDrop={addFiles} />

        {files.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold">Upload Queue</h2>
                <p className="text-sm text-[var(--color-muted)] mt-1">
                  {files.length} file{files.length !== 1 ? 's' : ''} ({completedCount} completed, {pendingCount} pending)
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={clearAll}
                  disabled={isProcessing}
                  className="p-2 text-[var(--color-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors disabled:opacity-50"
                  title="Clear All"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                {completedCount > 0 && (
                  <button
                    onClick={clearCompleted}
                    disabled={isProcessing}
                    className="text-sm px-4 py-2 border border-[var(--color-border)] rounded-xl hover:bg-[var(--color-surface-hover)] transition-colors disabled:opacity-50"
                  >
                    Clear Completed
                  </button>
                )}
                {pendingCount > 0 ? (
                  <button
                    onClick={handleStartAnalysis}
                    disabled={isProcessing}
                    className="bg-[var(--color-accent)] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[var(--color-accent-hover)] transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                          <Sparkles className="w-4 h-4" />
                        </motion.div>
                        Analyzing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Analyze {pendingCount} File{pendingCount !== 1 ? 's' : ''}
                      </span>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="bg-[var(--color-success)] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    View Catalogue
                  </button>
                )}
              </div>
            </div>

            <UploadProgress files={files as unknown as FileItem[]} onRemove={removeFile} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
