from contextlib import AbstractContextManager
from fastapi import HTTPException
from passlib.context import CryptContext
from typing import Callable
from sqlalchemy.orm import Session
from sqlalchemy.orm.exc import NoResultFound
from utils import hash_password, verify_password, create_access_token
from .models import Mushroom
from .schemas import (
    MushroomSchemaCreate,
)
# linijka poniżej jest odpowiedzialna za hashowanie haseł w bazie danych
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# funkcja poniżej jest odpowiedzialna za dodawanie obiektów do bazy danych\
def add_to_db(session, obj) -> None:
    session.add(obj)
    session.commit()
    session.refresh(obj)

# klasa poniżej jest odpowiedzialna za operacje na bazie danych

class MushroomRepository:
    def __init__(self,session_factory: Callable[[], AbstractContextManager[Session]]) -> None:
        self.session_factory = session_factory

    def get_all(self):
        with self.session_factory() as session:
            return session.query(Mushroom).all()
        
    def get_by_id(self, mushroom_id: int):
        with self.session_factory() as session:
            return session.query(Mushroom).filter(Mushroom.mushroomID==mushroom_id).first()

    def add(self, mushroom: MushroomSchemaCreate) -> Mushroom:
        with self.session_factory() as session:
            mushroom = Mushroom(**mushroom.model_dump())
            session.add(mushroom)
            session.commit()
            session.refresh(mushroom)
            return mushroom
      
