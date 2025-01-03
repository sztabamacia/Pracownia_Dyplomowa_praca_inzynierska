from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from utils import refresh_token

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/token/refresh")
async def refresh_access_token(token: str = Depends(oauth2_scheme)):
    new_token = refresh_token(token)
    if not new_token:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"access_token": new_token, "token_type": "bearer"}