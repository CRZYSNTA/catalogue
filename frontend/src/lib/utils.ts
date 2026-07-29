import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(min: number | null, max: number | null): string {
  if (!min && !max) return "N/A";
  if (min && max) return `₹${min.toFixed(0)} - ₹${max.toFixed(0)}`;
  if (min) return `From ₹${min.toFixed(0)}`;
  return `Up to ₹${max!.toFixed(0)}`;
}

export function getConfidenceLevel(score: number | null): 'high' | 'medium' | 'low' {
  if (!score) return 'low';
  if (score >= 0.8) return 'high';
  if (score >= 0.5) return 'medium';
  return 'low';
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}
