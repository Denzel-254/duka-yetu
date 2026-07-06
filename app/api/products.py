"""Product routes."""

from fastapi import APIRouter

router = APIRouter()

@router.get("/ping")
async def ping():
    """Test endpoint."""
    return {"message": "Products API is working!"}
