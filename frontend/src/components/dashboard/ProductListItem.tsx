import Link from 'next/link';
import { Product } from '@/types/product';
import { ConfidenceBadge } from './ConfidenceBadge';

export function ProductListItem({ product }: { product: Product }) {
  return (
    <div className="flex items-center gap-6 p-5 bg-[var(--color-surface)] border-b border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-all duration-200 ease-in-out group">
      <div className="w-16 h-16 bg-[var(--color-surface-hover)] shrink-0 flex items-center justify-center p-2">
        <img 
          src={product.image_url} 
          alt={product.product_name || ''} 
          className="max-w-full max-h-full object-contain mix-blend-multiply"
        />
      </div>
      
      <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        <div className="col-span-1 md:col-span-2">
          <h4 className="text-[13px] font-medium text-[var(--color-primary)] truncate tracking-tight uppercase">{product.product_name || 'Untitled'}</h4>
          <p className="text-[11px] font-medium text-[var(--color-muted)] truncate uppercase tracking-wider mt-1">{product.category || 'Uncategorized'}</p>
        </div>
        
        <div className="hidden md:block">
          <ConfidenceBadge score={product.confidence} />
        </div>
        
        <div className="hidden md:block text-[13px] font-medium tracking-tight">
          {product.price_min && product.price_max ? `₹${product.price_min} - ₹${product.price_max}` : '-'}
        </div>
      </div>
      
      <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
  );
}
