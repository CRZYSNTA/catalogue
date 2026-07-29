'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Upload, 
  Package, 
  Download, 
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ className, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/upload', label: 'Upload', icon: Upload },
    { href: '/dashboard/catalogue', label: 'Catalogue', icon: Package },
    // { href: '/dashboard/export', label: 'Export', icon: Download },
  ];

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={cn(
          "flex flex-col w-64 border-r border-[var(--color-border)] bg-[var(--color-surface)] h-screen shrink-0",
          "fixed inset-y-0 left-0 z-50 lg:static lg:translate-x-0 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex items-center gap-3 p-8 h-24 border-b border-[var(--color-border)]">
          <div className="text-[var(--color-primary)]">
            <Sparkles className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <span className="font-medium text-sm tracking-tight text-[var(--color-primary)] uppercase">CatalogueAI</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={onClose} // Close sidebar on mobile when a link is clicked
                className={cn(
                  "flex items-center gap-4 px-5 py-3 text-[13px] font-medium transition-all duration-200 ease-in-out border-l-2",
                  isActive 
                    ? "border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent" 
                    : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-primary)]"
                )}
              >
                <Icon className="w-5 h-5" strokeWidth={1.5} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
