from contextlib import AbstractContextManager
from fastapi import HTTPException
from passlib.context import CryptContext
from typing import Callable, List
from sqlalchemy.orm import Session
from sqlalchemy.orm.exc import NoResultFound
from utils import hash_password, verify_password, create_access_token
from .models import Mushroom
from .schemas import MushroomSchemaCreate

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def add_to_db(session, obj) -> None:
    session.add(obj)
    session.commit()
    session.refresh(obj)

class MushroomRepository:
    def __init__(self, session_factory: Callable[[], AbstractContextManager[Session]]) -> None:
        self.session_factory = session_factory

    def get_all(self):
        with self.session_factory() as session:
            return session.query(Mushroom).all()
        
    def get_by_id(self, mushroom_id: int):
        with self.session_factory() as session:
            return session.query(Mushroom).filter(Mushroom.mushroomID == mushroom_id).first()

    def add(self, mushrooms: List[MushroomSchemaCreate]) -> List[Mushroom]:
        with self.session_factory() as session:
            added_mushrooms = []
            for mushroom_data in mushrooms:
                mushroom = Mushroom(**mushroom_data.model_dump())
                session.add(mushroom)
                session.commit()
                session.refresh(mushroom)
                added_mushrooms.append(mushroom)
            return added_mushrooms
        
    def delete(self, mushroom_id: int) -> None:
        with self.session_factory() as session:
            mushroom = session.query(Mushroom).filter(Mushroom.mushroomID == mushroom_id).first()
            if not mushroom:
                raise HTTPException(status_code=404, detail="Mushroom not found")
            session.delete(mushroom)
            session.commit()

    def get_by_name(self, name: str):
        with self.session_factory() as session:
            return session.query(Mushroom).filter(Mushroom.scientificName == name).first()