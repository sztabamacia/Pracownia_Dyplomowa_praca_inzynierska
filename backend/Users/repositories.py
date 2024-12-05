from contextlib import AbstractContextManager
from fastapi import HTTPException
from passlib.context import CryptContext
from typing import Callable
from sqlalchemy.orm import Session
from sqlalchemy.orm.exc import NoResultFound
from utils import hash_password, verify_password, create_access_token
from .models import User
from .schemas import (
    UserSchemaCreate,
    UserSchemaUpdate,
    UserSchemaLogin,
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def add_to_db(session, obj) -> None:
    session.add(obj)
    session.commit()
    session.refresh(obj)

class UserRepository:
    def __init__(self,session_factory: Callable[[], AbstractContextManager[Session]]) -> None:
        self.session_factory = session_factory

    def get_all(self):
        with self.session_factory() as session:
            return session.query(User).all()
        
    def get_by_id(self, user_id: int):
        with self.session_factory() as session:
            return session.query(User).filter(User.userID==user_id).first()
    
    def add(self, user: UserSchemaCreate) -> User:
        with self.session_factory() as session:
            user = User(**user.model_dump())
            user.passwordHash = hash_password(user.passwordHash)
            session.add(user)
            session.commit()
            session.refresh(user)
            return user
    
    def delete_by_id(self, user_id: int):
        with self.session_factory() as session:
            user = session.query(User).filter(User.userID==user_id).first()
            if not user:
                raise NoResultFound
            session.delete(user)
            session.commit()
    
    def update(self, user_id: int, user: UserSchemaUpdate):
        with self.session_factory() as session:
            entity: User = session.query(User).filter(User.userID==user_id).first()
            if not user:
                raise NoResultFound
            entity.username = user.username
            entity.email = user.email
            entity.passwordHash = hash_password(user.passwordHash)
            session.commit()
            session.refresh(entity)
            return entity
    
    def login(self, user: UserSchemaLogin):
        with self.session_factory() as session:
            fetched_user = session.query(User).filter(User.email == user.email).first()

        if not fetched_user:
            raise HTTPException(status_code=401, detail="Incorrect email")

        if not pwd_context.verify(user.passwordHash, fetched_user.passwordHash):
            raise HTTPException(status_code=401, detail="Incorrect password")

        token = create_access_token({"userID": fetched_user.userID})
        return {"token": token, "userID": fetched_user.userID}
