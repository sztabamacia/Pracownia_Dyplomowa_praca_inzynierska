from .models import Mushroom
from .schemas import MushroomSchemaCreate
from .repositories import MushroomRepository
from typing import List

class MushroomService:
    def __init__(self, mushroom_repository: MushroomRepository) -> None:
        self._repository: MushroomRepository = mushroom_repository
    
    def get_mushrooms(self) -> List[Mushroom]:
        return self._repository.get_all()
    
    def get_mushroom(self, mushroom_id: int) -> Mushroom:
        return self._repository.get_by_id(mushroom_id)
    
    def create_mushrooms(self, mushrooms: List[MushroomSchemaCreate]) -> List[Mushroom]:
        return self._repository.add(mushrooms)
    
    def delete_mushroom(self, mushroom_id: int) -> None:
        return self._repository.delete(mushroom_id)
    
    def get_mushroom_by_name(self, name: str) -> Mushroom:
        return self._repository.get_by_name(name)