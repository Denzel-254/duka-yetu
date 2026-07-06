"""Sales routes."""

from fastapi import APIRouter

router = APIRouter()

@router.get("/ping")
async def ping():
    """Test endpoint."""
    return {"message": "Sales API is working!"}
