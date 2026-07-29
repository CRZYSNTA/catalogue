'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import type { Product } from '@/types/product';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const limit = 12;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getProducts({ search: search || undefined, category: category || undefined, page, limit });
      setProducts(res.data);
      setTotal(res.total);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const totalPages = Math.ceil(total / limit);

  return {
    products,
    total,
    loading,
    error,
    page,
    totalPages,
    search,
    category,
    setPage,
    setSearch,
    setCategory,
    refetch: fetchProducts,
  };
}
