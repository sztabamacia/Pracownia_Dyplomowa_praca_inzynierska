from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserSchema(BaseModel):
    userID: int
    username: str
    email: str
    passwordHash: str
    createdAt: Optional[datetime]

    class Config:
        orm_mode = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v is not None else None
        }

class UserSchemaCreate(BaseModel):
    username: str
    email: str
    passwordHash: str

class UserSchemaUpdate(BaseModel):
    username: str
    email: str
    passwordHash: str

class UserSchemaLogin(BaseModel):
    email: str
    passwordHash: str

class UserSchemaBase(BaseModel):
    id: int
    username: str
    email: str

