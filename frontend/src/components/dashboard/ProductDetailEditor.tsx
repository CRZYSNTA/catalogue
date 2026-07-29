'use client';

import { useState } from 'react';
import { Product, ProductUpdate } from '@/types/product';
import { Save, X, Plus } from 'lucide-react';

interface ProductDetailEditorProps {
  product: Product;
  onSave: (data: ProductUpdate) => Promise<void>;
  onCancel: () => void;
}

export function ProductDetailEditor({ product, onSave, onCancel }: ProductDetailEditorProps) {
  const [formData, setFormData] = useState<ProductUpdate>({
    product_name: product.product_name || '',
    short_title: product.short_title || '',
    category: product.category || '',
    subcategory: product.subcategory || '',
    description: product.description || '',
    price_min: product.price_min || undefined,
    price_max: product.price_max || undefined,
    materials: product.materials || [],
    colors: product.colors || [],
    style: product.style || '',
    seo_keywords: product.seo_keywords || [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof ProductUpdate, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: keyof ProductUpdate, value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, [field]: array }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(formData);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center bg-[var(--color-surface)] p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] sticky top-0 z-10">
        <h3 className="font-semibold text-[var(--color-primary)]">Edit Product</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium border border-[var(--color-border)] rounded-[var(--radius-md)] hover:bg-[var(--color-surface-hover)]"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[var(--color-accent)] text-white rounded-[var(--radius-md)] hover:bg-[var(--color-accent-light)]"
            disabled={isSubmitting}
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-[var(--color-primary)] border-b border-[var(--color-border)] pb-2">Basic Info</h4>
          <div>
            <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">Product Name</label>
            <input
              type="text"
              value={formData.product_name || ''}
              onChange={(e) => handleChange('product_name', e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] bg-transparent text-sm focus:ring-1 focus:ring-[var(--color-accent)]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">Category</label>
              <input
                type="text"
                value={formData.category || ''}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] bg-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">Subcategory</label>
              <input
                type="text"
                value={formData.subcategory || ''}
                onChange={(e) => handleChange('subcategory', e.target.value)}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] bg-transparent text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">Min Price (₹)</label>
              <input
                type="number"
                value={formData.price_min || ''}
                onChange={(e) => handleChange('price_min', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] bg-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">Max Price (₹)</label>
              <input
                type="number"
                value={formData.price_max || ''}
                onChange={(e) => handleChange('price_max', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] bg-transparent text-sm"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-[var(--color-primary)] border-b border-[var(--color-border)] pb-2">Description & SEO</h4>
          <div>
            <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] bg-transparent text-sm resize-none focus:ring-1 focus:ring-[var(--color-accent)]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">SEO Keywords (comma separated)</label>
            <input
              type="text"
              value={formData.seo_keywords?.join(', ')}
              onChange={(e) => handleArrayChange('seo_keywords', e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] bg-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-muted)] mb-1">Materials (comma separated)</label>
            <input
              type="text"
              value={formData.materials?.join(', ')}
              onChange={(e) => handleArrayChange('materials', e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] bg-transparent text-sm"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
