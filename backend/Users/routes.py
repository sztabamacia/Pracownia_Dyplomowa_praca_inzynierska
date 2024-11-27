from fastapi import APIRouter, Depends, Body, HTTPException
from dependency_injector.wiring import inject, Provide
from containers import Container
from .schemas import UserSchemaCreate, UserSchema, UserSchemaUpdate, UserSchemaLogin
from .services import UserService
from passlib.context import CryptContext
from fastapi.encoders import jsonable_encoder


router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.get("/get/list", response_model=list[UserSchema], status_code=200, tags=["User"])
@inject
async def get_users(user_service: UserService = Depends(Provide[Container.user_service])):
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
async def get_user(user_id: int, user_service: UserService = Depends(Provide[Container.user_service])):
    return jsonable_encoder(user_service.get_user(user_id))

@router.put("/update/{user_id}", response_model=UserSchema, status_code=200, tags=["User"])
@inject
async def update_user(
    user_service=Depends(Provide[Container.user_service]),
    user_id: int = None,
    user: UserSchemaUpdate = Body(...),
):
    return user_service.update_user(user_id, user)


@router.delete("/delete/{user_id}", status_code=204, tags=["User"])
@inject
async def delete_user(
    user_service=Depends(Provide[Container.user_service]),
    user_id: int = None,
):
    return user_service.delete_user(user_id)


@router.post("/login", tags=["User"])
@inject
def login(
    user: UserSchemaLogin,
    user_service: UserService = Depends(Provide[Container.user_service]),
):
    return user_service.login(user)