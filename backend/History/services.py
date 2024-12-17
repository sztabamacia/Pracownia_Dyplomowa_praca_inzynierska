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
    
    def get_histories_by_user_id(self, user_id: int) -> list[History]:
        return self._repository.get_by_user_id(user_id)

    def get_history_by_user_id_and_history_id(self, user_id: int, history_id: int) -> History:
        return self._repository.get_by_user_id_and_history_id(user_id, history_id)
    
    def create_history(self, history: HistorySchemaCreate) -> History:
        return self._repository.add(history)
    
    def delete_history(self, history_id: int) -> None:
        return self._repository.delete(history_id)