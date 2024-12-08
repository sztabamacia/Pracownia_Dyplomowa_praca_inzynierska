from fastapi import APIRouter, Depends, Body, HTTPException
from dependency_injector.wiring import inject, Provide
from containers import Container
from .schemas import HistorySchemaCreate, HistorySchema
from .services import HistoryService

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
async def get_histories_by_user_id(user_id: int, history_service: HistoryService = Depends(Provide[Container.history_service])):
    return history_service.get_histories_by_user_id(user_id)

@router.get("/get/user/{user_id}/history/{history_id}", response_model=HistorySchema, status_code=200, tags=["History"])
@inject
async def get_history_by_user_id_and_history_id(user_id: int, history_id: int, history_service: HistoryService = Depends(Provide[Container.history_service])):
    return history_service.get_history_by_user_id_and_history_id(user_id, history_id)