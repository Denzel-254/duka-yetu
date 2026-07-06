"""Dashboard routes."""

from fastapi import APIRouter

router = APIRouter()

@router.get("/ping")
async def ping():
    """Test endpoint."""
    return {"message": "Dashboard API is working!"}
