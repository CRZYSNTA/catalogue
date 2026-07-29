'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Product } from '@/types/product';
import { ConfidenceBadge } from './ConfidenceBadge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 0.99, y: -2, transition: { duration: 0.2, ease: "easeInOut" } }}
      className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-none overflow-hidden shadow-none transition-all duration-200 ease-in-out flex flex-col h-full"
    >
      <div className="relative aspect-[4/5] bg-[var(--color-surface-hover)] p-6 flex items-center justify-center">
        <img 
          src={product.image_url} 
          alt={product.product_name || 'Product Image'} 
          className="max-w-full max-h-full object-contain mix-blend-multiply"
          loading="lazy"
        />
        <div className="absolute top-3 right-3">
          <ConfidenceBadge score={product.confidence} />
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-[var(--color-primary)] truncate flex-1 pr-2 tracking-tight uppercase" title={product.product_name || 'Untitled'}>
            {product.product_name || 'Untitled Product'}
          </h3>
        </div>
        
        {product.category && (
          <span className="inline-block text-[11px] font-medium text-[var(--color-muted)] mb-3 self-start uppercase tracking-wider">
            {product.category}
          </span>
        )}
        
        <p className="text-[13px] text-[var(--color-secondary)] line-clamp-2 mb-6 flex-1 font-light leading-relaxed">
          {product.description || 'No description available.'}
        </p>
        
        <div className="mt-auto pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
          <div className="text-[13px] font-medium text-[var(--color-primary)] tracking-tight">
            {product.price_min && product.price_max 
              ? `₹${product.price_min} - ₹${product.price_max}`
              : 'Price N/A'}
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={`/dashboard/products/${product.id}?edit=true`}
              className="text-[12px] font-medium text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors duration-200 uppercase tracking-wider"
            >
              Edit
            </Link>
            <Link 
              href={`/dashboard/products/${product.id}`}
              className="text-[12px] font-medium text-[var(--color-primary)] hover:text-[var(--color-muted)] transition-colors duration-200 uppercase tracking-wider"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
