import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'image' | 'circular';
}

export function Skeleton({ className, variant = 'text' }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-[var(--color-surface-hover)] rounded-[var(--radius-md)]",
        variant === 'text' && "h-4 w-full",
        variant === 'card' && "h-64 w-full rounded-[var(--radius-lg)]",
        variant === 'image' && "aspect-square w-full rounded-[var(--radius-lg)]",
        variant === 'circular' && "rounded-full w-12 h-12",
        className
      )}
    />
  );
}
