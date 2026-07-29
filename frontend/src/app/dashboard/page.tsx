"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, PackageX } from "lucide-react";
import { useRouter } from "next/navigation";

import { useProducts } from "@/hooks/useProducts";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ProductCard } from "@/components/dashboard/ProductCard";
import { ProductListItem } from "@/components/dashboard/ProductListItem";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { CategoryFilter } from "@/components/dashboard/CategoryFilter";
import { ViewToggle } from "@/components/dashboard/ViewToggle";
import { ExportMenu } from "@/components/dashboard/ExportMenu";
import { Skeleton } from "@/components/ui/Skeleton";
import { Product } from "@/types/product";

export default function DashboardPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const router = useRouter();
  
  const { 
    products, 
    total, 
    loading, 
    search, 
    category, 
    setSearch, 
    setCategory,
    page,
    totalPages,
    setPage
  } = useProducts();

  // Extract unique categories (ideally this comes from an API, but for now we derive it)
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[];
  
  // Calculate average confidence
  const avgConfidence = products.length > 0 
    ? products.reduce((acc, p) => acc + (p.confidence || 0), 0) / products.length
    : 0;
    
  // Recent products (last 7 days - just a mock filter for now, assumes recent are first)
  const recentProductsCount = Math.min(products.length, 5);

  const handleProductClick = (product: Product) => {
    router.push(`/dashboard/products/${product.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-[var(--color-muted)] mt-1">Manage and view your generated product catalogue.</p>
        </div>
        <Link 
          href="/dashboard/upload" 
          className="bg-[var(--color-accent)] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[var(--color-accent-hover)] transition-colors flex items-center gap-2 shadow-sm"
        >
          <Upload className="w-4 h-4" />
          Upload Images
        </Link>
      </div>

      <StatsCards 
        stats={{
          total: total,
          recent: recentProductsCount,
          categories: categories.length,
          avgConfidence: avgConfidence
        }}
      />

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 w-full md:w-auto gap-4 flex-col sm:flex-row">
          <SearchBar onSearch={setSearch} />
          <CategoryFilter selected={category} onChange={setCategory} categories={categories} />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto justify-between sm:justify-end">
          <ViewToggle view={view} onChange={setView} />
          <div className="w-px h-6 bg-[var(--color-border)] hidden sm:block"></div>
          <ExportMenu />
        </div>
      </div>

      <div className="min-h-[400px]">
        {loading ? (
          <div className={view === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
            {[...Array(8)].map((_, i) => (
              view === 'grid' ? (
                <div key={i} className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4 space-y-4">
                  <Skeleton className="w-full aspect-square rounded-xl" />
                  <Skeleton className="w-3/4 h-5" />
                  <Skeleton className="w-1/2 h-4" />
                  <div className="flex gap-2">
                    <Skeleton className="w-16 h-6 rounded-full" />
                    <Skeleton className="w-16 h-6 rounded-full" />
                  </div>
                </div>
              ) : (
                <div key={i} className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 flex gap-4">
                  <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2 py-2">
                    <Skeleton className="w-1/3 h-5" />
                    <Skeleton className="w-1/4 h-4" />
                  </div>
                </div>
              )
            ))}
          </div>
        ) : products.length > 0 ? (
          <motion.div 
            layout
            className={view === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-3"}
          >
            <AnimatePresence mode="popLayout">
              {products.map(product => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {view === 'grid' ? (
                    <ProductCard product={product} />
                  ) : (
                    <ProductListItem product={product} />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center text-center py-20 px-4 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] border-dashed"
          >
            <div className="w-16 h-16 bg-[var(--color-background)] rounded-full flex items-center justify-center mb-4">
              <PackageX className="w-8 h-8 text-[var(--color-muted)]" />
            </div>
            <h3 className="text-xl font-bold mb-2">No products found</h3>
            <p className="text-[var(--color-muted)] max-w-md mx-auto mb-6">
              {search || category 
                ? "We couldn't find any products matching your current filters. Try adjusting them."
                : "Your catalogue is currently empty. Upload some product images to get started."}
            </p>
            {!(search || category) && (
              <Link 
                href="/dashboard/upload" 
                className="bg-[var(--color-primary)] text-[var(--color-surface)] dark:bg-[var(--color-surface)] dark:text-[var(--color-primary)] px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                Upload First Product
              </Link>
            )}
          </motion.div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6 pb-10">
          <button 
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] disabled:opacity-50 hover:bg-[var(--color-surface-hover)] transition-colors"
          >
            Previous
          </button>
          <span className="text-sm font-medium px-4">
            Page {page} of {totalPages}
          </span>
          <button 
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] disabled:opacity-50 hover:bg-[var(--color-surface-hover)] transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
