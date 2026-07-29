from supabase import create_client, Client
from config import settings
from typing import List, Optional, Dict, Any
from models.product import ProductCreate, ProductUpdate
from fastapi import HTTPException
import uuid

# Monkey-patch Supabase python client to bypass strict JWT validation for non-JWT keys
import supabase._sync.client
import re
# Override the validation in __init__ if needed, or just patch the regex
original_init = supabase._sync.client.SyncClient.__init__
def new_init(self, supabase_url, supabase_key, options):
    # Temporarily allow any key by skipping the regex check
    # We'll just call original init and ignore the exception, or patch the regex module used in client
    pass

supabase._sync.client.re.match = lambda pattern, string, flags=0: True

supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

class SupabaseService:
    @staticmethod
    def upload_image(file_bytes: bytes, filename: str, content_type: str, user_id: str) -> str:
        """Uploads an image to Supabase Storage and returns the public URL."""
        path = f"{user_id}/{uuid.uuid4()}_{filename}"
        try:
            res = supabase.storage.from_(settings.SUPABASE_STORAGE_BUCKET).upload(
                path, file_bytes, {"content-type": content_type}
            )
            return supabase.storage.from_(settings.SUPABASE_STORAGE_BUCKET).get_public_url(path)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")

    @staticmethod
    def create_product(product_data: ProductCreate, user_id: str) -> Dict[str, Any]:
        """Inserts a new product into the products table."""
        data = product_data.model_dump()
        data["user_id"] = user_id
        try:
            response = supabase.table("products").insert(data).execute()
            if not response.data:
                raise Exception("No data returned from insert")
            return response.data[0]
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to create product: {str(e)}")

    @staticmethod
    def get_products(user_id: str, search: Optional[str] = None, category: Optional[str] = None, limit: int = 10, offset: int = 0) -> dict:
        """Queries products with optional filters and text search. Returns data and total count."""
        query = supabase.table("products").select("*", count="exact").eq("user_id", user_id)
        if search:
            query = query.or_(f"product_name.ilike.%{search}%,category.ilike.%{search}%,tags.cs.{{{search}}}")
        if category:
            query = query.eq("category", category)
        try:
            response = query.order("created_at", desc=True).range(offset, offset + limit - 1).execute()
            return {"data": response.data, "total": response.count or 0}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to fetch products: {str(e)}")

    @staticmethod
    def get_product(product_id: str, user_id: str) -> Dict[str, Any]:
        """Gets a single product by ID."""
        try:
            response = supabase.table("products").select("*").eq("id", product_id).eq("user_id", user_id).execute()
            if not response.data:
                raise HTTPException(status_code=404, detail="Product not found")
            return response.data[0]
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to fetch product: {str(e)}")

    @staticmethod
    def update_product(product_id: str, user_id: str, data: ProductUpdate) -> Dict[str, Any]:
        """Updates a product."""
        update_data = {k: v for k, v in data.model_dump(exclude_unset=True).items()}
        try:
            response = supabase.table("products").update(update_data).eq("id", product_id).eq("user_id", user_id).execute()
            if not response.data:
                raise HTTPException(status_code=404, detail="Product not found or not updated")
            return response.data[0]
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to update product: {str(e)}")

    @staticmethod
    def delete_product(product_id: str, user_id: str) -> bool:
        """Deletes a product from the DB."""
        try:
            response = supabase.table("products").delete().eq("id", product_id).eq("user_id", user_id).execute()
            if not response.data:
                raise HTTPException(status_code=404, detail="Product not found or not deleted")
            return True
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to delete product: {str(e)}")

    @staticmethod
    def get_all_products(user_id: str) -> List[Dict[str, Any]]:
        """Gets all products for export without pagination."""
        try:
            response = supabase.table("products").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
            return response.data
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to fetch all products: {str(e)}")
