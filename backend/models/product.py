from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime

class ProductBase(BaseModel):
    product_name: Optional[str] = None
    short_title: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    description: Optional[str] = None
    materials: Optional[list[str]] = Field(default_factory=list)
    colors: Optional[list[str]] = Field(default_factory=list)
    pattern: Optional[str] = None
    style: Optional[str] = None
    shape: Optional[str] = None
    finish: Optional[str] = None
    target_audience: Optional[list[str]] = Field(default_factory=list)
    features: Optional[list[str]] = Field(default_factory=list)
    benefits: Optional[list[str]] = Field(default_factory=list)
    use_cases: Optional[list[str]] = Field(default_factory=list)
    selling_points: Optional[list[str]] = Field(default_factory=list)
    seo_keywords: Optional[list[str]] = Field(default_factory=list)
    tags: Optional[list[str]] = Field(default_factory=list)
    price_min: Optional[float] = None
    price_max: Optional[float] = None
    confidence: Optional[float] = None

class ProductCreate(ProductBase):
    image_url: str

class ProductUpdate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: UUID
    user_id: UUID
    image_url: str
    created_at: datetime
    updated_at: datetime

class PaginatedProducts(BaseModel):
    data: list[ProductResponse]
    total: int
    page: int
    limit: int

class AnalysisResponse(ProductBase):
    pass
