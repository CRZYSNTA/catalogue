'use client';

import { Grid3X3, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onChange: (view: 'grid' | 'list') => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center p-1 bg-[var(--color-surface-hover)] rounded-[var(--radius-md)] border border-[var(--color-border)]">
      <button
        onClick={() => onChange('grid')}
        className={cn(
          "p-1.5 rounded-[var(--radius-sm)] transition-colors",
          view === 'grid' 
            ? "bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm" 
            : "text-[var(--color-muted)] hover:text-[var(--color-primary)]"
        )}
      >
        <Grid3X3 className="w-4 h-4" />
      </button>
      <button
        onClick={() => onChange('list')}
        className={cn(
          "p-1.5 rounded-[var(--radius-sm)] transition-colors",
          view === 'list' 
            ? "bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm" 
            : "text-[var(--color-muted)] hover:text-[var(--color-primary)]"
        )}
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
}
