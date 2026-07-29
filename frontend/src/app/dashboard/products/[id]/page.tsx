"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Edit3, Trash2, RotateCw, Copy, Sparkles, 
  CheckCircle2, AlertTriangle, Tag, IndianRupee, List, ChevronRight
} from "lucide-react";
import { toast } from "sonner";

import { api } from "@/services/api";
import { Product, ProductUpdate } from "@/types/product";
import { ConfidenceBadge } from "@/components/dashboard/ConfidenceBadge";
import { ImageZoom } from "@/components/dashboard/ImageZoom";
import { ProductDetailEditor } from "@/components/dashboard/ProductDetailEditor";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatPrice } from "@/lib/utils";

type Tab = 'details' | 'seo' | 'raw';

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
  const [activeTab, setActiveTab] = useState<Tab>('details');

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
          <Skeleton className="w-1/2 aspect-square rounded-3xl" />
          <div className="flex-1 space-y-4 pt-10">
            <Skeleton className="w-2/3 h-12" />
            <Skeleton className="w-1/4 h-8" />
            <Skeleton className="w-full h-40" />
            <Skeleton className="w-full h-16" />
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
      className="pb-20 max-w-7xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-muted)] hover:text-[#008040] transition-colors"
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
                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full text-sm font-medium hover:bg-[#E8F3EB] dark:hover:bg-green-900/30 transition-colors disabled:opacity-50"
              >
                <RotateCw className={`w-4 h-4 ${actionLoading === 'retry' ? 'animate-spin' : ''}`} />
                Re-analyze
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading !== null}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 rounded-full text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left Column: Image Area */}
          <div className="relative space-y-6">
            <div className="relative bg-[#E8F3EB] dark:bg-green-950/40 rounded-[2.5rem] p-8 aspect-[4/5] flex items-center justify-center border border-green-100 dark:border-green-900/50">
              
              {/* Floating Badges */}
              <div className="absolute top-6 left-6 space-y-3 z-10">
                <div className="bg-white/90 dark:bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-white/20 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#008040] dark:text-green-400" />
                  <span className="text-sm font-semibold">AI Confidence: {Math.round((product.confidence || 0) * 100)}%</span>
                </div>
                {product.category && (
                  <div className="bg-white/90 dark:bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-white/20 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#008040] dark:text-green-400" />
                    <span className="text-sm font-semibold capitalize">{product.category}</span>
                  </div>
                )}
              </div>

              {/* Product Image */}
              <div 
                className="w-full h-full relative cursor-zoom-in group"
                onClick={() => setIsZoomOpen(true)}
              >
                <img 
                  src={product.image_url} 
                  alt={product.product_name || "Product Image"}
                  className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Feature Highlights Row */}
            <div className="grid grid-cols-3 gap-4">
              {(product.materials && product.materials.length > 0 ? product.materials.slice(0, 3) : ['Durable', 'Premium', 'Eco-friendly']).map((feat, i) => (
                <div key={i} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 text-center shadow-sm flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#E8F3EB] dark:bg-green-900/40 text-[#008040] dark:text-green-400 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Details Area */}
          <div className="flex flex-col py-6 lg:py-10">
            {/* Title & Badges */}
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-[var(--color-text)]">
              {product.product_name}
            </h1>
            
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center gap-1 text-sm font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                AI Generated
              </span>
              <span className="text-sm text-[var(--color-muted)] flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-[#008040]" /> Highly Accurate
              </span>
            </div>

            {/* Price */}
            {(product.price_min || product.price_max) && (
              <div className="mb-8 flex items-baseline gap-2">
                <IndianRupee className="w-6 h-6 text-[var(--color-text)]" />
                <span className="text-3xl font-bold text-[var(--color-text)]">
                  {formatPrice(product.price_min || null, product.price_max || null)}
                </span>
              </div>
            )}

            {/* Custom Tabs */}
            <div className="flex gap-6 border-b border-[var(--color-border)] mb-6">
              {[
                { id: 'details', label: 'Details' },
                { id: 'seo', label: 'SEO Keywords' },
                { id: 'raw', label: 'Raw Data' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`pb-4 text-sm font-semibold transition-colors relative ${
                    activeTab === tab.id 
                      ? 'text-[#008040] dark:text-green-400' 
                      : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="activeTab" 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#008040] dark:bg-green-400" 
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[200px] mb-8">
              {activeTab === 'details' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="relative group">
                    <p className="text-base text-[var(--color-muted)] leading-relaxed whitespace-pre-wrap">
                      {product.description || "No description generated."}
                    </p>
                    <div className="absolute -top-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-[var(--color-background)] p-1 rounded-lg">
                      <button 
                        onClick={() => handleRegenerateField('description')}
                        className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md shadow-sm hover:text-[#008040]"
                        title="Regenerate Description"
                      >
                        <Sparkles className={`w-4 h-4 ${actionLoading === 'regen_description' ? 'animate-pulse text-[#008040]' : ''}`} />
                      </button>
                      <button 
                        onClick={() => copyToClipboard(product.description || '', 'Description')}
                        className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md shadow-sm hover:text-blue-500"
                        title="Copy"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {product.colors && product.colors.length > 0 && (
                    <div className="mt-4">
                      <span className="text-sm font-bold block mb-2">Available Colors</span>
                      <div className="flex gap-2">
                        {product.colors.map(c => (
                          <span key={c} className="px-3 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full text-sm font-medium">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'seo' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="relative group">
                    <div className="flex flex-wrap gap-2 pr-16">
                      {product.seo_keywords && product.seo_keywords.length > 0 ? (
                        product.seo_keywords.map((kw, i) => (
                          <span key={i} className="px-3 py-1.5 bg-[#E8F3EB] text-[#008040] dark:bg-green-900/30 dark:text-green-300 rounded-lg text-sm font-medium">
                            {kw}
                          </span>
                        ))
                      ) : (
                        <span className="text-[var(--color-muted)]">No SEO keywords generated.</span>
                      )}
                    </div>
                    <div className="absolute -top-2 right-0 flex gap-2">
                      <button 
                        onClick={() => handleRegenerateField('seo_keywords')}
                        className="p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md shadow-sm hover:text-[#008040]"
                        title="Regenerate Keywords"
                      >
                        <Sparkles className={`w-4 h-4 ${actionLoading === 'regen_seo_keywords' ? 'animate-pulse text-[#008040]' : ''}`} />
                      </button>
                    </div>
                  </div>
                  {product.target_audience && (
                    <div>
                      <span className="text-sm font-bold block mb-1">Target Audience</span>
                      <p className="text-[var(--color-muted)] text-sm">{product.target_audience}</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'raw' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 overflow-auto max-h-[300px]">
                    <pre className="text-xs text-[var(--color-muted)] font-mono">
                      {JSON.stringify(product, null, 2)}
                    </pre>
                  </div>
                </motion.div>
              )}
            </div>

            {/* AI Generation Stats Info Box */}
            <div className="bg-gradient-to-r from-[#E8F3EB] to-transparent dark:from-green-900/20 dark:to-transparent rounded-2xl p-5 mb-8 border border-green-100 dark:border-green-900/30">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#008040] dark:text-green-400 mb-1">AI Extracted Features</h4>
                  <p className="text-xs text-[var(--color-muted)]">
                    {product.materials?.length || 0} materials, {product.colors?.length || 0} colors, {product.seo_keywords?.length || 0} keywords identified.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white dark:bg-black/40 flex items-center justify-center shadow-sm">
                  <Sparkles className="w-5 h-5 text-[#008040] dark:text-green-400" />
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => setIsEditing(true)}
              className="w-full flex items-center justify-center gap-2 py-4 bg-[#008040] dark:bg-[#006030] text-white rounded-2xl text-lg font-bold hover:bg-[#006633] dark:hover:bg-[#004d26] transition-colors shadow-lg shadow-green-900/20"
            >
              <Edit3 className="w-5 h-5" />
              Edit Product Details
            </button>
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
