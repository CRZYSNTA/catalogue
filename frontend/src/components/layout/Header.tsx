'use client';

import { usePathname } from 'next/navigation';
import { Sun, Moon, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Header() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDark(!isDark);
  };

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname.includes('/upload')) return 'Upload Products';
    if (pathname.includes('/products/')) return 'Product Details';
    if (pathname.includes('/catalogue')) return 'Catalogue';
    return 'Dashboard';
  };

  return (
    <header className="h-24 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between px-12 sticky top-0 z-10">
      <div className="flex items-center gap-6">
        <button className="lg:hidden text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors duration-200 ease-in-out">
          <Menu className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <h1 className="text-[13px] font-medium tracking-tight text-[var(--color-secondary)] uppercase">{getPageTitle()}</h1>
      </div>
      
      <div className="flex items-center gap-6">
        <button 
          onClick={toggleTheme}
          className="p-2 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-all duration-200 ease-in-out"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="w-5 h-5" strokeWidth={1.5} /> : <Moon className="w-5 h-5" strokeWidth={1.5} />}
        </button>
        <div className="w-8 h-8 rounded-full border border-[var(--color-border)] overflow-hidden">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
            alt="Avatar" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
