from typing import Callable
from contextlib import contextmanager, AbstractContextManager
from sqlalchemy import create_engine, orm
from sqlalchemy.orm import Session
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Database:

    def __init__(self, url: str) -> None:
        self._engine = create_engine(url)
        self._session_factory = orm.scoped_session(
            orm.sessionmaker(
                autocommit=False,
                autoflush=False,
                bind=self._engine
            ),
            
        )

    def create_database(self) -> None:
        Base.metadata.create_all(self._engine)
    
    @contextmanager
    def session(self) -> Callable[..., AbstractContextManager[Session]]:
        session: Session = self._session_factory()
        try:
            yield session
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()