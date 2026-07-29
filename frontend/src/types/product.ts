export interface Product {
  id: string;
  user_id: string;
  image_url: string;
  product_name: string | null;
  short_title: string | null;
  category: string | null;
  subcategory: string | null;
  description: string | null;
  materials: string[];
  colors: string[];
  pattern: string | null;
  style: string | null;
  shape: string | null;
  finish: string | null;
  target_audience: string[];
  features: string[];
  benefits: string[];
  use_cases: string[];
  selling_points: string[];
  seo_keywords: string[];
  tags: string[];
  price_min: number | null;
  price_max: number | null;
  confidence: number | null;
  created_at: string;
  updated_at: string;
}

export interface ProductUpdate {
  product_name?: string | null;
  short_title?: string | null;
  category?: string | null;
  subcategory?: string | null;
  description?: string | null;
  materials?: string[];
  colors?: string[];
  pattern?: string | null;
  style?: string | null;
  shape?: string | null;
  finish?: string | null;
  target_audience?: string[];
  features?: string[];
  benefits?: string[];
  use_cases?: string[];
  selling_points?: string[];
  seo_keywords?: string[];
  tags?: string[];
  price_min?: number | null;
  price_max?: number | null;
  confidence?: number | null;
}

export interface UploadResponse {
  image_url: string;
  filename: string;
}

export interface BulkUploadResponse {
  image_urls: string[];
}

export interface AnalyzeRequest {
  image_url: string;
}

export interface BulkAnalyzeRequest {
  image_urls: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export type FileStatus = 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';

export interface UploadFileItem {
  id: string;
  file: File;
  preview: string;
  status: FileStatus;
  progress: number;
  imageUrl?: string;
  product?: Product;
  error?: string;
}
