"""Image upload routes for Duka Yetu."""

import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from fastapi.responses import JSONResponse
from app.core.dependencies import get_current_user
from app.core.config import settings
import uuid
import time
from typing import Optional

router = APIRouter()

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)

# Maximum file size (5MB)
MAX_FILE_SIZE = 5 * 1024 * 1024
ALLOWED_MIME_TYPES = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
    'image/bmp': '.bmp'
}

def validate_image_file(file: UploadFile) -> None:
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(
            status_code=400,
            detail="File must be an image. Only JPEG, PNG, GIF, WEBP, SVG, and BMP are allowed."
        )
    
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. Allowed types: JPEG, PNG, GIF, WEBP, SVG, BMP"
        )
    
    if file.filename:
        allowed_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'}
        file_ext = '.' + file.filename.split('.')[-1].lower() if '.' in file.filename else ''
        if file_ext and file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file extension. Allowed: JPG, JPEG, PNG, GIF, WEBP, SVG, BMP"
            )

def validate_file_size(contents: bytes) -> None:
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Image must be less than 5MB (current: {len(contents) // (1024 * 1024)}MB)"
        )
    
    if len(contents) == 0:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty"
        )

def generate_secure_filename(original_filename: str) -> str:
    ext = ''
    if original_filename and '.' in original_filename:
        ext = '.' + original_filename.split('.')[-1].lower()
    
    unique_id = str(uuid.uuid4())
    timestamp = int(time.time())
    return f"{timestamp}_{unique_id}{ext}"

@router.post("/")
async def upload_image(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user)
):
    """
    Upload an image to Cloudinary.
    """
    try:
        # Step 1: Validate the image file
        validate_image_file(file)
        
        # Step 2: Read file content
        contents = await file.read()
        
        # Step 3: Validate file size
        validate_file_size(contents)
        
        # Step 4: Generate secure filename
        secure_filename = generate_secure_filename(file.filename)
        
        # Step 5: Create folder path for this business
        folder_path = f"duka_yetu/{current_user.business_id}/products"
        
        # Step 6: Upload to Cloudinary
        try:
            upload_options = {
                "folder": folder_path,
                "public_id": secure_filename,
                "transformation": [
                    {'width': 800, 'height': 800, 'crop': 'limit', 'quality': 'auto:best'},
                    {'fetch_format': 'auto'}
                ],
                "resource_type": "image",
                "allowed_formats": ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'],
                "invalidate": True,
                "unique_filename": False,
                "use_filename": True,
                "overwrite": True
            }
            
            # Add upload preset if configured
            if hasattr(settings, 'CLOUDINARY_UPLOAD_PRESET') and settings.CLOUDINARY_UPLOAD_PRESET:
                upload_options["upload_preset"] = settings.CLOUDINARY_UPLOAD_PRESET
            
            result = cloudinary.uploader.upload(
                contents,
                **upload_options
            )
            
            # Return success response
            return JSONResponse(
                status_code=200,
                content={
                    "success": True,
                    "url": result["secure_url"],
                    "public_id": result["public_id"],
                    "format": result.get("format", ""),
                    "width": result.get("width", 0),
                    "height": result.get("height", 0),
                    "size": result.get("bytes", 0)
                }
            )
            
        except cloudinary.exceptions.Error as e:
            error_msg = str(e)
            print(f"Cloudinary error: {error_msg}")
            
            # Return STRING error messages (not objects)
            if "missing permissions" in error_msg.lower() or "forbidden" in error_msg.lower():
                raise HTTPException(
                    status_code=403,
                    detail="Cloudinary API key does not have upload permissions. Please check your Cloudinary settings or create an upload preset."
                )
            elif "folder" in error_msg.lower() and "not found" in error_msg.lower():
                raise HTTPException(
                    status_code=403,
                    detail="Cannot access or create folder. Please check folder permissions in Cloudinary."
                )
            elif "rate" in error_msg.lower() and "limit" in error_msg.lower():
                raise HTTPException(
                    status_code=429,
                    detail="Too many upload requests. Please wait and try again."
                )
            elif "invalid" in error_msg.lower() and "api" in error_msg.lower():
                raise HTTPException(
                    status_code=401,
                    detail="Cloudinary API credentials are invalid. Please check your configuration."
                )
            else:
                raise HTTPException(
                    status_code=500,
                    detail=f"Cloudinary upload failed: {error_msg}"
                )
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Upload failed: {str(e)}"
        )