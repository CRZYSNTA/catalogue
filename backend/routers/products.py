from fastapi import APIRouter, Header, HTTPException, Query
from typing import List, Optional
from models.product import ProductResponse, ProductUpdate, ProductCreate, PaginatedProducts
from services.supabase_service import SupabaseService
from services.gemini_service import GeminiService
from pydantic import BaseModel

router = APIRouter()

class RegenerateRequest(BaseModel):
    field: str

@router.get("", response_model=PaginatedProducts)
def get_products(
    search: Optional[str] = None,
    category: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    x_user_id: str = Header(...)
):
    offset = (page - 1) * limit
    result = SupabaseService.get_products(x_user_id, search, category, limit, offset)
    return PaginatedProducts(data=result["data"], total=result["total"], page=page, limit=limit)

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: str, x_user_id: str = Header(...)):
    return SupabaseService.get_product(product_id, x_user_id)

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: str, data: ProductUpdate, x_user_id: str = Header(...)):
    return SupabaseService.update_product(product_id, x_user_id, data)

@router.delete("/{product_id}")
def delete_product(product_id: str, x_user_id: str = Header(...)):
    SupabaseService.delete_product(product_id, x_user_id)
    return {"status": "deleted"}

@router.post("/{product_id}/retry-analysis", response_model=ProductResponse)
def retry_analysis(product_id: str, x_user_id: str = Header(...)):
    product = SupabaseService.get_product(product_id, x_user_id)
    analysis = GeminiService.analyze_image(product["image_url"])
    update_data = ProductUpdate(**analysis.model_dump(exclude_unset=True))
    return SupabaseService.update_product(product_id, x_user_id, update_data)

@router.post("/{product_id}/regenerate", response_model=ProductResponse)
def regenerate_field(product_id: str, request: RegenerateRequest, x_user_id: str = Header(...)):
    product = SupabaseService.get_product(product_id, x_user_id)
    new_value = GeminiService.regenerate_field(product["image_url"], request.field)
    update_data = ProductUpdate(**{request.field: new_value})
    return SupabaseService.update_product(product_id, x_user_id, update_data)
