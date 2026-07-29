from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import upload, products, export
from config import settings

app = FastAPI(title="AI-Powered Product Catalogue Generator API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
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
