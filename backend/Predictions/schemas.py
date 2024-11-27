from pydantic import BaseModel
from typing import List, Tuple

class PredictionRequest(BaseModel):
    file: bytes

class PredictionResponse(BaseModel):
    predictions: List[Tuple[str, float]]