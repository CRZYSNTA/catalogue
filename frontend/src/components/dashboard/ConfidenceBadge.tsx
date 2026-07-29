import { cn } from '@/lib/utils';

export function ConfidenceBadge({ score }: { score: number | null }) {
  if (score === null || score === undefined) return null;

  let colorClass = '';
  let label = '';

  if (score >= 0.8) {
    colorClass = 'bg-[var(--color-success)] text-white';
    label = 'High';
  } else if (score >= 0.5) {
    colorClass = 'bg-[var(--color-warning)] text-white';
    label = 'Medium';
  } else {
    colorClass = 'bg-[var(--color-error)] text-white';
    label = 'Low';
  }

  return (
    <span className={cn("px-2 py-0.5 text-xs font-medium rounded-full", colorClass)}>
      {label} {(score * 100).toFixed(0)}%
    </span>
  );
}
