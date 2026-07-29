'use client';

import { motion } from 'framer-motion';
import { Package, Sparkles, FolderOpen, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Stat {
  label: string;
  value: string | number;
  icon: any;
  color: string;
  bgColor: string;
}

interface StatsCardsProps {
  stats: {
    total: number;
    recent: number;
    categories: number;
    avgConfidence: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards: Stat[] = [
    {
      label: 'Total Products',
      value: stats.total,
      icon: Package,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Recently Analysed',
      value: stats.recent,
      icon: Sparkles,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Categories',
      value: stats.categories,
      icon: FolderOpen,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      label: 'Avg. Confidence',
      value: `${(stats.avgConfidence * 100).toFixed(0)}%`,
      icon: TrendingUp,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {cards.map((stat, i) => (
        <motion.div
          key={i}
          variants={item}
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-sm)]"
        >
          <div className="flex items-center gap-4">
            <div className={cn("p-3 rounded-[var(--radius-md)]", stat.bgColor, stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-muted)]">{stat.label}</p>
              <h3 className="text-2xl font-semibold text-[var(--color-primary)] mt-1">{stat.value}</h3>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
