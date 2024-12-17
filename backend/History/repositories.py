from contextlib import AbstractContextManager
from fastapi import HTTPException
from typing import Callable
from sqlalchemy.orm import Session
from .models import History
from .schemas import HistorySchemaCreate
from Users.models import User
from Mushrooms.models import Mushroom
from customError import CustomError

class HistoryRepository:
    def __init__(self, session_factory: Callable[[], AbstractContextManager[Session]]) -> None:
        self.session_factory = session_factory

    def get_all(self):
        with self.session_factory() as session:
            return session.query(History).all()
        
    def get_by_id(self, history_id: int):
        with self.session_factory() as session:
            return session.query(History).filter(History.historyID == history_id).first()
        
    def get_by_user_id(self, user_id: int):
        with self.session_factory() as session:
            return session.query(History).filter(History.userID == user_id).all()

    def get_by_user_id_and_history_id(self, user_id: int, history_id: int):
        with self.session_factory() as session:
            return session.query(History).filter(History.userID == user_id, History.historyID == history_id).first()

    def add(self, history: HistorySchemaCreate) -> History:
        with self.session_factory() as session:
            user_exists = session.query(User).filter(User.userID == history.userID).first() is not None
            if not user_exists:
                raise CustomError(404, "User with the given user_id does not exist")

            mushroom_exists1 = session.query(Mushroom).filter(Mushroom.mushroomID == history.mushroomID1).first() is not None
            mushroom_exists2 = session.query(Mushroom).filter(Mushroom.mushroomID == history.mushroomID2).first() is not None
            mushroom_exists3 = session.query(Mushroom).filter(Mushroom.mushroomID == history.mushroomID3).first() is not None

            if not mushroom_exists1:
                raise CustomError(404, "Mushroom with the given mushroom_id 1 does not exist")
            if not mushroom_exists2:
                raise CustomError(404, "Mushroom with the given mushroom_id 2 does not exist")
            if not mushroom_exists3:
                raise CustomError(404, "Mushroom with the given mushroom_id 3 does not exist")
            if len(set([history.mushroomID1, history.mushroomID2, history.mushroomID3])) != 3:
                raise CustomError(400, "Mushrooms id's cannot be the same")

            history = History(**history.model_dump())
            session.add(history)
            session.commit()
            session.refresh(history)
            return history

    def delete(self, history_id: int) -> None:
        with self.session_factory() as session:
            history = session.query(History).filter(History.historyID == history_id).first()
            if not history:
                raise HTTPException(status_code=404, detail="History not found")
            session.delete(history)
            session.commit()