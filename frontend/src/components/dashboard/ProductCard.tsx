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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all flex flex-col h-full"
    >
      <div className="relative aspect-square bg-[var(--color-surface-hover)]">
        <img 
          src={product.image_url} 
          alt={product.product_name || 'Product Image'} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-3 right-3">
          <ConfidenceBadge score={product.confidence} />
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-[var(--color-primary)] truncate flex-1 pr-2" title={product.product_name || 'Untitled'}>
            {product.product_name || 'Untitled Product'}
          </h3>
        </div>
        
        {product.category && (
          <span className="inline-block px-2 py-1 text-xs font-medium bg-[var(--color-surface-hover)] text-[var(--color-muted)] rounded-[var(--radius-sm)] mb-3 self-start">
            {product.category}
          </span>
        )}
        
        <p className="text-sm text-[var(--color-muted)] line-clamp-2 mb-4 flex-1">
          {product.description || 'No description available.'}
        </p>
        
        <div className="mt-auto pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
          <div className="text-sm font-medium text-[var(--color-primary)]">
            {product.price_min && product.price_max 
              ? `₹${product.price_min} - ₹${product.price_max}`
              : 'Price N/A'}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/products/${product.id}?edit=true`}
              className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-1"
            >
              Edit
            </Link>
            <Link 
              href={`/dashboard/products/${product.id}`}
              className="text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-light)] transition-colors"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
