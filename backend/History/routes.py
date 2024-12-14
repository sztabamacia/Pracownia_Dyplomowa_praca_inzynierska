from fastapi import APIRouter, Depends, Body, HTTPException, Request, Response
from dependency_injector.wiring import inject, Provide
from containers import Container
from .schemas import HistorySchemaCreate, HistorySchema
from .services import HistoryService
from utils import oauth2_scheme, get_user_id_from_token
from fastapi.security import HTTPAuthorizationCredentials
from Users.schemas import UserSchema 

router = APIRouter()

@router.get("/get/list", response_model=list[HistorySchema], status_code=200, tags=["History"])
@inject
async def get_histories(history_service: HistoryService = Depends(Provide[Container.history_service])):
    return history_service.get_histories()

@router.get("/get/{history_id}", response_model=HistorySchema, status_code=200, tags=["History"])
@inject
async def get_history(history_id: int, history_service: HistoryService = Depends(Provide[Container.history_service])):
    return history_service.get_history(history_id)

@router.post("/create", response_model=HistorySchema, status_code=201, tags=["History"])
@inject
async def create_history(
    history_service = Depends(Provide[Container.history_service]),
    history: HistorySchemaCreate = Body(...),
):
    return history_service.create_history(history)

@router.get("/get/list/user/{user_id}", response_model=list[HistorySchema], status_code=200, tags=["History"])
@inject
async def get_history_list_by_user_id(
    user_id: int,
    history_service: HistoryService = Depends(Provide[Container.history_service]),
    token: HTTPAuthorizationCredentials = Depends(oauth2_scheme)
):
    token_user_id = get_user_id_from_token(token.credentials)
    if token_user_id != str(user_id):
        raise HTTPException(status_code=403, detail="Not authorized to access this resource")
    
    return history_service.get_histories_by_user_id(user_id)

@router.get("/get/user/{user_id}/history/{history_id}", response_model=HistorySchema, status_code=200, tags=["History"])
@inject
async def get_history_by_user_id_and_history_id(
    user_id: int,
    history_id: int,
    history_service: HistoryService = Depends(Provide[Container.history_service]),
    token: HTTPAuthorizationCredentials = Depends(oauth2_scheme)
):
    token_user_id = get_user_id_from_token(token.credentials)
    if token_user_id != str(user_id):
        raise HTTPException(status_code=403, detail="Not authorized to access this resource")
    
    return history_service.get_history_by_user_id_and_history_id(user_id, history_id)