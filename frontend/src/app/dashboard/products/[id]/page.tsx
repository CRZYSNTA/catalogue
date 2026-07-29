"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Edit3, Trash2, RotateCw, Copy, Sparkles, 
  CheckCircle2, AlertTriangle, Tag, IndianRupee, List
} from "lucide-react";
import { toast } from "sonner";

import { api } from "@/services/api";
import { Product, ProductUpdate } from "@/types/product";
import { ConfidenceBadge } from "@/components/dashboard/ConfidenceBadge";
import { ImageZoom } from "@/components/dashboard/ImageZoom";
import { ProductDetailEditor } from "@/components/dashboard/ProductDetailEditor";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatPrice } from "@/lib/utils";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const searchParams = useSearchParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await api.getProduct(id);
        setProduct(data);
      } catch (error) {
        toast.error("Failed to load product");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id, router]);

  useEffect(() => {
    if (searchParams.get('edit') === 'true') {
      setIsEditing(true);
    }
  }, [searchParams]);

  const handleSave = async (updates: ProductUpdate) => {
    try {
      setActionLoading('save');
      const updated = await api.updateProduct(id, updates);
      setProduct(updated);
      setIsEditing(false);
      toast.success("Product updated successfully");
    } catch (error) {
      toast.error("Failed to update product");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      try {
        setActionLoading('delete');
        await api.deleteProduct(id);
        toast.success("Product deleted");
        router.push("/dashboard");
      } catch (error) {
        toast.error("Failed to delete product");
        setActionLoading(null);
      }
    }
  };

  const handleRetryAnalysis = async () => {
    try {
      setActionLoading('retry');
      const updated = await api.retryAnalysis(id);
      setProduct(updated);
      toast.success("Analysis complete");
    } catch (error) {
      toast.error("Analysis failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRegenerateField = async (field: 'description' | 'seo_keywords') => {
    try {
      setActionLoading(`regen_${field}`);
      const updated = await api.regenerateField(id, field);
      setProduct(updated);
      toast.success(`${field === 'description' ? 'Description' : 'Keywords'} regenerated`);
    } catch (error) {
      toast.error("Regeneration failed");
    } finally {
      setActionLoading(null);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="flex gap-4">
          <Skeleton className="w-1/3 aspect-square rounded-2xl" />
          <div className="flex-1 space-y-4">
            <Skeleton className="w-2/3 h-10" />
            <Skeleton className="w-1/4 h-6" />
            <Skeleton className="w-full h-32" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="w-full h-20" />
              <Skeleton className="w-full h-20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-20"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
        
        <div className="flex items-center gap-2">
          {!isEditing && (
            <>
              <button
                onClick={handleRetryAnalysis}
                disabled={actionLoading !== null}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm font-medium hover:bg-[var(--color-surface-hover)] transition-colors disabled:opacity-50"
              >
                <RotateCw className={`w-4 h-4 ${actionLoading === 'retry' ? 'animate-spin' : ''}`} />
                Re-analyze
              </button>
              <button
                onClick={() => setIsEditing(true)}
                disabled={actionLoading !== null}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50"
              >
                <Edit3 className="w-4 h-4" />
                Edit Details
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading !== null}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 rounded-xl text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 shadow-sm">
          <ProductDetailEditor 
            product={product} 
            onSave={handleSave} 
            onCancel={() => setIsEditing(false)} 
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Image */}
          <div className="lg:col-span-1 space-y-4">
            <div 
              className="relative aspect-square rounded-3xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] cursor-zoom-in group shadow-sm"
              onClick={() => setIsZoomOpen(true)}
            >
              <img 
                src={product.image_url} 
                alt={product.product_name || "Product Image"}
                className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
            </div>

            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-[var(--color-muted)] mb-3 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> AI Confidence
              </h3>
              <div className="flex items-center gap-4">
                <ConfidenceBadge score={product.confidence} />
                <span className="text-sm text-[var(--color-muted)]">
                  Based on image clarity and extractable features.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {product.category && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                )}
                {(product.price_min || product.price_max) && (
                  <span className="px-3 py-1 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full text-sm font-medium flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5" />
                    {formatPrice(product.price_min || null, product.price_max || null)}
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">{product.product_name}</h1>
              
              <div className="relative group">
                <p className="text-lg text-[var(--color-muted)] leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button 
                    onClick={() => handleRegenerateField('description')}
                    className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-sm hover:text-[var(--color-accent)]"
                    title="Regenerate with AI"
                  >
                    <Sparkles className={`w-4 h-4 ${actionLoading === 'regen_description' ? 'animate-pulse text-[var(--color-accent)]' : ''}`} />
                  </button>
                  <button 
                    onClick={() => copyToClipboard(product.description || '', 'Description')}
                    className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-sm hover:text-[var(--color-primary)]"
                    title="Copy"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Materials & Attributes */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <List className="w-5 h-5 text-[var(--color-muted)]" />
                  Attributes
                </h3>
                <dl className="space-y-3 text-sm">
                  {product.materials && product.materials.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 py-2 border-b border-[var(--color-border)]/50">
                      <dt className="text-[var(--color-muted)] font-medium">Materials</dt>
                      <dd className="col-span-2 font-medium">{product.materials.join(", ")}</dd>
                    </div>
                  )}
                  {product.colors && product.colors.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 py-2 border-b border-[var(--color-border)]/50">
                      <dt className="text-[var(--color-muted)] font-medium">Colors</dt>
                      <dd className="col-span-2 font-medium">
                        <div className="flex flex-wrap gap-1">
                          {product.colors.map(c => (
                            <span key={c} className="px-2 py-0.5 bg-[var(--color-background)] rounded text-xs border border-[var(--color-border)]">{c}</span>
                          ))}
                        </div>
                      </dd>
                    </div>
                  )}
                  {product.style && (
                    <div className="grid grid-cols-3 gap-2 py-2 border-b border-[var(--color-border)]/50">
                      <dt className="text-[var(--color-muted)] font-medium">Style</dt>
                      <dd className="col-span-2 font-medium">{product.style}</dd>
                    </div>
                  )}
                  {product.pattern && (
                    <div className="grid grid-cols-3 gap-2 py-2 border-b border-[var(--color-border)]/50">
                      <dt className="text-[var(--color-muted)] font-medium">Pattern</dt>
                      <dd className="col-span-2 font-medium">{product.pattern}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Marketing & SEO */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[var(--color-muted)]" />
                    SEO & Marketing
                  </h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleRegenerateField('seo_keywords')}
                      className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors"
                      title="Regenerate Keywords"
                    >
                      <Sparkles className={`w-4 h-4 ${actionLoading === 'regen_seo_keywords' ? 'animate-pulse text-[var(--color-accent)]' : ''}`} />
                    </button>
                    <button 
                      onClick={() => copyToClipboard((product.seo_keywords || []).join(", "), 'Keywords')}
                      className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                      title="Copy Keywords"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--color-muted)] mb-2">Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.seo_keywords && product.seo_keywords.length > 0 ? (
                        product.seo_keywords.map((kw, i) => (
                          <span key={i} className="px-2.5 py-1 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-lg text-xs font-medium">
                            {kw}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-[var(--color-muted)]">No keywords generated</span>
                      )}
                    </div>
                  </div>

                  {product.target_audience && (
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--color-muted)] mb-1">Target Audience</h4>
                      <p className="text-sm font-medium">{product.target_audience}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ImageZoom 
        src={product.image_url} 
        alt={product.product_name || 'Product Image'} 
        isOpen={isZoomOpen} 
        onClose={() => setIsZoomOpen(false)} 
      />
    </motion.div>
  );
}
