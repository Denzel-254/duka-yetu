"""Authentication routes."""

from fastapi import APIRouter

router = APIRouter()

@router.get("/ping")
async def ping():
    """Test endpoint."""
    return {"message": "Auth API is working!"}
