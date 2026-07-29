import Link from 'next/link';
import { Product } from '@/types/product';
import { ConfidenceBadge } from './ConfidenceBadge';

export function ProductListItem({ product }: { product: Product }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] hover:bg-[var(--color-surface-hover)] transition-colors group">
      <div className="w-16 h-16 rounded-[var(--radius-md)] overflow-hidden bg-[var(--color-background)] shrink-0">
        <img 
          src={product.image_url} 
          alt={product.product_name || ''} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="col-span-1 md:col-span-2">
          <h4 className="font-medium text-[var(--color-primary)] truncate">{product.product_name || 'Untitled'}</h4>
          <p className="text-sm text-[var(--color-muted)] truncate">{product.category || 'Uncategorized'}</p>
        </div>
        
        <div className="hidden md:block">
          <ConfidenceBadge score={product.confidence} />
        </div>
        
        <div className="hidden md:block text-sm font-medium">
          {product.price_min && product.price_max ? `₹${product.price_min} - ₹${product.price_max}` : '-'}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Link 
          href={`/dashboard/products/${product.id}?edit=true`}
          className="px-4 py-2 text-sm font-medium bg-[var(--color-surface)] text-[var(--color-primary)] border border-[var(--color-border)] rounded-[var(--radius-md)] hover:border-[var(--color-accent)] transition-colors whitespace-nowrap"
        >
          Edit
        </Link>
        <Link 
          href={`/dashboard/products/${product.id}`}
          className="px-4 py-2 text-sm font-medium bg-[var(--color-background)] text-[var(--color-primary)] border border-[var(--color-border)] rounded-[var(--radius-md)] hover:border-[var(--color-accent)] transition-colors whitespace-nowrap"
        >
          Details
        </Link>
      </div>
    </div>
  );
}
