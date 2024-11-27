from fastapi import APIRouter, UploadFile, File, HTTPException
from .models import predict_top_3_classes
from .schemas import PredictionRequest, PredictionResponse
import os
import uuid

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG and PNG are supported.")

    # Ensure the temp directory exists
    temp_dir = "temp"
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)

    temp_file_path = f"temp/{uuid.uuid4()}.jpg"
    with open(temp_file_path, "wb") as temp_file:
        temp_file.write(await file.read())

    predictions = predict_top_3_classes(temp_file_path)

    os.remove(temp_file_path)

    return PredictionResponse(predictions=predictions)