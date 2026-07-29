'use client';

import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, FileJson, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/services/api';
import { toast } from 'sonner';

export function ExportMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handleExport = async (type: 'csv' | 'excel' | 'json') => {
    setIsOpen(false);
    setIsExporting(type);
    
    try {
      let blob;
      let filename = `catalogue-${new Date().toISOString().split('T')[0]}`;
      
      if (type === 'csv') {
        blob = await api.exportCSV();
        filename += '.csv';
      } else if (type === 'excel') {
        blob = await api.exportExcel();
        filename += '.xlsx';
      } else {
        blob = await api.exportJSON();
        filename += '.json';
      }
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`Successfully exported ${type.toUpperCase()}`);
    } catch (error) {
      toast.error(`Failed to export ${type.toUpperCase()}`);
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm font-medium hover:bg-[var(--color-surface-hover)] transition-colors shadow-[var(--shadow-sm)]"
        disabled={!!isExporting}
      >
        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        Export
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-[var(--shadow-lg)] z-20 py-1">
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-left text-[var(--color-primary)] hover:bg-[var(--color-surface-hover)]"
            >
              <FileText className="w-4 h-4 text-blue-500" />
              CSV (.csv)
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-left text-[var(--color-primary)] hover:bg-[var(--color-surface-hover)]"
            >
              <FileSpreadsheet className="w-4 h-4 text-green-500" />
              Excel (.xlsx)
            </button>
            <button
              onClick={() => handleExport('json')}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-left text-[var(--color-primary)] hover:bg-[var(--color-surface-hover)]"
            >
              <FileJson className="w-4 h-4 text-yellow-500" />
              JSON (.json)
            </button>
          </div>
        </>
      )}
    </div>
  );
}
