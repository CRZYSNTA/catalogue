import { createClient } from '@/lib/supabase/client';
import type { Product, ProductUpdate, PaginatedResponse, UploadResponse, BulkUploadResponse } from '@/types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function getAuthHeaders(): Promise<Record<string, string>> {
  // Auth check bypassed - returning dummy user ID
  return {
    'x-user-id': '00000000-0000-0000-0000-000000000000',
  };
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || 'Request failed');
  }
  return res.json();
}

export const api = {
  // Upload
  async uploadImage(file: File): Promise<UploadResponse> {
    const headers = await getAuthHeaders();
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(error.detail || 'Upload failed');
    }
    return res.json();
  },

  async bulkUpload(files: File[]): Promise<BulkUploadResponse> {
    const headers = await getAuthHeaders();
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));
    const res = await fetch(`${API_URL}/api/bulk-upload`, {
      method: 'POST',
      headers,
      body: formData,
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(error.detail || 'Upload failed');
    }
    return res.json();
  },

  // Analyze
  async analyzeImage(imageUrl: string): Promise<Product> {
    return apiFetch<Product>('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: imageUrl }),
    });
  },

  async bulkAnalyze(imageUrls: string[]): Promise<Product[]> {
    return apiFetch<Product[]>('/api/bulk-analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_urls: imageUrls }),
    });
  },

  // Products CRUD
  async getProducts(params: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<PaginatedResponse<Product>> {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.set('search', params.search);
    if (params.category) searchParams.set('category', params.category);
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    return apiFetch<PaginatedResponse<Product>>(`/api/products?${searchParams.toString()}`);
  },

  async getProduct(id: string): Promise<Product> {
    return apiFetch<Product>(`/api/products/${id}`);
  },

  async updateProduct(id: string, data: ProductUpdate): Promise<Product> {
    return apiFetch<Product>(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async deleteProduct(id: string): Promise<void> {
    await apiFetch(`/api/products/${id}`, { method: 'DELETE' });
  },

  // AI Actions
  async retryAnalysis(id: string): Promise<Product> {
    return apiFetch<Product>(`/api/products/${id}/retry-analysis`, { method: 'POST' });
  },

  async regenerateField(id: string, field: string): Promise<Product> {
    return apiFetch<Product>(`/api/products/${id}/regenerate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field }),
    });
  },

  // Export
  async exportCSV(): Promise<Blob> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/export/csv`, { headers });
    if (!res.ok) throw new Error('Export failed');
    return res.blob();
  },

  async exportJSON(): Promise<Blob> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/export/json`, { headers });
    if (!res.ok) throw new Error('Export failed');
    return res.blob();
  },

  async exportExcel(): Promise<Blob> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/export/excel`, { headers });
    if (!res.ok) throw new Error('Export failed');
    return res.blob();
  },
};
