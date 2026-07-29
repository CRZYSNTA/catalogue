from fastapi import APIRouter, UploadFile, File, Header, HTTPException
from typing import List
from pydantic import BaseModel
from services.supabase_service import SupabaseService
from services.gemini_service import GeminiService
from models.product import ProductResponse, ProductCreate

router = APIRouter()

class AnalyzeRequest(BaseModel):
    image_url: str

class BulkAnalyzeRequest(BaseModel):
    image_urls: List[str]

@router.post("/upload")
async def upload_image(file: UploadFile = File(...), x_user_id: str = Header(...)):
    """Uploads an image to Supabase Storage."""
    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only jpg, png, webp allowed.")
    contents = await file.read()
    image_url = SupabaseService.upload_image(contents, file.filename, file.content_type, x_user_id)
    return {"image_url": image_url, "filename": file.filename}

@router.post("/analyze", response_model=ProductResponse)
async def analyze_image(request: AnalyzeRequest, x_user_id: str = Header(...)):
    """Analyzes an image and saves the product to DB."""
    analysis = GeminiService.analyze_image(request.image_url)
    product_data = ProductCreate(**analysis.model_dump(), image_url=request.image_url)
    db_product = SupabaseService.create_product(product_data, x_user_id)
    return db_product

@router.post("/bulk-upload")
async def bulk_upload(files: List[UploadFile] = File(...), x_user_id: str = Header(...)):
    """Uploads multiple images."""
    urls = []
    for file in files:
        if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
            raise HTTPException(status_code=400, detail=f"Invalid file type for {file.filename}")
        contents = await file.read()
        url = SupabaseService.upload_image(contents, file.filename, file.content_type, x_user_id)
        urls.append(url)
    return {"image_urls": urls}

@router.post("/bulk-analyze", response_model=List[ProductResponse])
async def bulk_analyze(request: BulkAnalyzeRequest, x_user_id: str = Header(...)):
    """Analyzes multiple images sequentially."""
    products = []
    for url in request.image_urls:
        analysis = GeminiService.analyze_image(url)
        product_data = ProductCreate(**analysis.model_dump(), image_url=url)
        db_product = SupabaseService.create_product(product_data, x_user_id)
        products.append(db_product)
    return products
