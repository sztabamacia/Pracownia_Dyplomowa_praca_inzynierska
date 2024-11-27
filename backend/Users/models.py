from db import Base
from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    userID = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    passwordHash = Column(String)
    createdAt = Column(DateTime, default=func.now())
    history = relationship("History", back_populates="user")