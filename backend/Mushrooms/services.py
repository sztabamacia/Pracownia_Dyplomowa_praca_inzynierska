from .models import Mushroom
from .schemas import (
    MushroomSchemaCreate,
)
from .repositories import MushroomRepository

class MushroomService:
    def __init__(self, mushroom_repository: MushroomRepository) -> None:
        self._repository: MushroomRepository = mushroom_repository
    
    def get_mushrooms(self) -> list[Mushroom]:
        return self._repository.get_all()
    
    def get_mushroom(self, mushroom_id: int) -> Mushroom:
        return self._repository.get_by_id(mushroom_id)
    
    def create_mushroom(self, mushroom: MushroomSchemaCreate) -> Mushroom:
        return self._repository.add(mushroom)