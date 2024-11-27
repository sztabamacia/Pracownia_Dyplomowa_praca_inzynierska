from fastapi import APIRouter, Depends, Body, HTTPException
from dependency_injector.wiring import inject, Provide
from containers import Container
from .schemas import MushroomSchemaCreate, MushroomSchema
from .services import MushroomService

router = APIRouter()

@router.get("/get/list", response_model=list[MushroomSchema], status_code=200, tags=["Mushroom"])
@inject
async def get_mushrooms(mushroom_service: MushroomService = Depends(Provide[Container.mushroom_service])):
    return mushroom_service.get_mushrooms()

@router.get("/get/{mushroom_id}", response_model=MushroomSchema, status_code=200, tags=["Mushroom"])
@inject
async def get_mushroom(mushroom_id: int, mushroom_service: MushroomService = Depends(Provide[Container.mushroom_service])):
    return mushroom_service.get_mushroom(mushroom_id)

@router.post("/create", response_model=MushroomSchema, status_code=201, tags=["Mushroom"])
@inject
async def create_mushroom(
    mushroom_service = Depends(Provide[Container.mushroom_service]),
    mushroom: MushroomSchemaCreate = Body(...),
):
    return mushroom_service.create_mushroom(mushroom)
