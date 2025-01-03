from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Response
from fastapi.security import HTTPAuthorizationCredentials
from dependency_injector.wiring import inject, Provide
from containers import Container
from .models import predict_top_3_classes
from .schemas import PredictionRequest, PredictionResponse
from utils import get_user_id_from_token, oauth2_scheme, create_access_token
from datetime import datetime
import os
import uuid
from History.services import HistoryService
from Users.services import UserService
from Mushrooms.services import MushroomService
from History.schemas import HistorySchemaCreate

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse)
@inject
async def predict(
    file: UploadFile = File(...),
    token: HTTPAuthorizationCredentials = Depends(oauth2_scheme),
    history_service: HistoryService = Depends(Provide[Container.history_service]),
    mushroom_service: MushroomService = Depends(Provide[Container.mushroom_service]),
    user_service: UserService = Depends(Provide[Container.user_service])
):
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG and PNG are supported.")

    # Ensure the permanent directory exists
    permanent_dir = "uploads"
    if not os.path.exists(permanent_dir):
        os.makedirs(permanent_dir)

    # Generate a unique file name based on userID and current time
    user_id = get_user_id_from_token(token.credentials)
    current_time = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    file_extension = file.filename.split(".")[-1]
    permanent_file_path = f"{permanent_dir}/{user_id}_{current_time}.{file_extension}"

    # Save the file permanently
    with open(permanent_file_path, "wb") as permanent_file:
        permanent_file.write(await file.read())

    predictions = predict_top_3_classes(permanent_file_path)

    # Find mushroom IDs based on names
    mushroom1 = mushroom_service.get_mushroom_by_name(predictions[0]["name"])
    mushroom2 = mushroom_service.get_mushroom_by_name(predictions[1]["name"])
    mushroom3 = mushroom_service.get_mushroom_by_name(predictions[2]["name"])

    if not mushroom1 or not mushroom2 or not mushroom3:
        raise HTTPException(status_code=404, detail="Mushroom not found")

    # Create new history entry
    history_entry = HistorySchemaCreate(
        userID=user_id,
        createdAt=datetime.utcnow(),
        file=permanent_file_path,  # Save the file path as a string
        mushroomID1=mushroom1.mushroomID,
        confidence1=float(predictions[0]["confidence"]),
        mushroomID2=mushroom2.mushroomID,
        confidence2=float(predictions[1]["confidence"]),
        mushroomID3=mushroom3.mushroomID,
        confidence3=float(predictions[2]["confidence"])
    )

    history_service.create_history(history_entry)

    formatted_predictions = [(pred["name"], float(pred["confidence"])) for pred in predictions]

    return PredictionResponse(predictions=formatted_predictions)