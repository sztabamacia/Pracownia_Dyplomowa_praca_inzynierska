from .models import History
from .schemas import (
    HistorySchemaCreate,
)
from .repositories import HistoryRepository

class HistoryService:
    def __init__(self, history_repository: HistoryRepository) -> None:
        self._repository: HistoryRepository = history_repository
    
    def get_histories(self) -> list[History]:
        return self._repository.get_all()
    
    def get_history(self, history_id: int) -> History:
        return self._repository.get_by_id(history_id)
    
    def create_history(self, history: HistorySchemaCreate) -> History:
        return self._repository.add(history)