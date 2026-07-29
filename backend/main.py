from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import xml.etree.ElementTree as ET

# Monkey-patch register_namespace to avoid openpyxl ValueError on Render
original_register_namespace = ET.register_namespace
def safe_register_namespace(prefix, uri):
    try:
        original_register_namespace(prefix, uri)
    except ValueError:
        pass
ET.register_namespace = safe_register_namespace

from routers import upload, products, export
from config import settings

app = FastAPI(title="AI-Powered Product Catalogue Generator API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(upload.router, prefix="/api", tags=["Upload & Analyze"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(export.router, prefix="/api/export", tags=["Export"])

@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "Backend is running smoothly"}
