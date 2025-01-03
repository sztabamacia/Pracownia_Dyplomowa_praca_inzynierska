from passlib.context import CryptContext
from fastapi.security import HTTPBearer
from datetime import datetime, timedelta
from jose import jwt, JWTError, ExpiredSignatureError
from settings import (
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_MINUTES
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

oauth2_scheme = HTTPBearer()

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def refresh_token(token: str):
    payload = decode_token(token)
    if payload:
        user_id = payload.get("sub")
        expires_delta = timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
        new_token = create_access_token({"sub": user_id}, expires_delta=expires_delta)
        return new_token
    return None

def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except ExpiredSignatureError:
        return None
    except JWTError:
        return None

def get_user_id_from_token(token: str):
    payload = decode_token(token)
    if payload:
        return payload.get("sub")
    return None