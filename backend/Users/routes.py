from fastapi import APIRouter, Depends, Body, HTTPException, Request, Response
from fastapi.security import HTTPAuthorizationCredentials
from dependency_injector.wiring import inject, Provide
from containers import Container
from .schemas import UserSchemaCreate, UserSchema, UserSchemaUpdate, UserSchemaLogin
from .services import UserService
from fastapi.encoders import jsonable_encoder
from utils import oauth2_scheme, get_user_id_from_token, create_access_token

router = APIRouter()

@router.get("/get/list", response_model=list[UserSchema], status_code=200, tags=["User"])
@inject
async def get_users(
    user_service: UserService = Depends(Provide[Container.user_service])):
    return user_service.get_users()

@router.post("/register", response_model=UserSchema, status_code=201, tags=["User"])
@inject
async def create_user(
    user_service=Depends(Provide[Container.user_service]),
    user: UserSchemaCreate = Body(...),
):
    return user_service.create_user(user)

@router.get("/get/{user_id}", response_model=UserSchema, status_code=200, tags=["User"])
@inject
async def get_user(
    user_id: int,
    request: Request,
    user_service: UserService = Depends(Provide[Container.user_service]),
    token: HTTPAuthorizationCredentials = Depends(oauth2_scheme)
):
    token_user_id = get_user_id_from_token(token.credentials)
    if token_user_id != str(user_id):
        raise HTTPException(status_code=403, detail="Not authorized to access this resource")
    
    return jsonable_encoder(user_service.get_user(user_id))

@router.patch("/update/{user_id}", response_model=UserSchema, status_code=200, tags=["User"])
@inject
async def update_user(
    user_id: int,
    request: Request,
    user: UserSchemaUpdate = Body(...),
    user_service=Depends(Provide[Container.user_service]),
    token: HTTPAuthorizationCredentials = Depends(oauth2_scheme)
):
    token_user_id = get_user_id_from_token(token.credentials)
    if token_user_id != str(user_id):
        raise HTTPException(status_code=403, detail="Not authorized to access this resource")
    
    return user_service.update_user(user_id, user)

@router.delete("/delete/{user_id}", status_code=204, tags=["User"])
@inject
async def delete_user(
    user_id: int,
    request: Request,
    user_service=Depends(Provide[Container.user_service]),
    token: HTTPAuthorizationCredentials = Depends(oauth2_scheme)
):
    token_user_id = get_user_id_from_token(token.credentials)
    if token_user_id != str(user_id):
        raise HTTPException(status_code=403, detail="Not authorized to access this resource")
    
    return user_service.delete_user(user_id)

@router.post("/login", tags=["User"])
@inject
async def login(
    response: Response,
    user: UserSchemaLogin,
    user_service: UserService = Depends(Provide[Container.user_service])
):
    user = user_service.login(user)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": str(user.userID)})
    response.set_cookie(key="access_token", value=access_token, httponly=True)
    return {"access_token": access_token, "token_type": "bearer"}