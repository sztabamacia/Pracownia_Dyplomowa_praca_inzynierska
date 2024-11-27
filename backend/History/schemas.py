from pydantic import BaseModel
from datetime import datetime

class HistorySchema(BaseModel):
    historyID: int
    userID: int
    createdAt: datetime
    file: bytes
    mushroomID1: int
    confidence1: float
    mushroomID2: int
    confidence2: float
    mushroomID3: int
    confidence3: float

    class Config:
        orm_mode = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v is not None else None
        }


class HistorySchemaCreate(BaseModel):
    userID: int
    file: bytes
    mushroomID1: int
    confidence1: float
    mushroomID2: int
    confidence2: float
    mushroomID3: int
    confidence3: float
