from db import Base
from sqlalchemy import Column, Integer, func, DateTime, BLOB, Float, ForeignKey, String
from sqlalchemy.orm import relationship

class History(Base):
    __tablename__ = "history"

    historyID = Column(Integer, primary_key=True, index=True)
    userID = Column(Integer, ForeignKey('users.userID'))
    createdAt = Column(DateTime, default=func.now())
    # file to link do obrazu
    file = Column(String)
    mushroomID1 = Column(Integer, ForeignKey('mushrooms.mushroomID'))  # Corrected ForeignKey
    confidence1 = Column(Float)
    mushroomID2 = Column(Integer, ForeignKey('mushrooms.mushroomID'))  # Corrected ForeignKey
    confidence2 = Column(Float)
    mushroomID3 = Column(Integer, ForeignKey('mushrooms.mushroomID'))  # Corrected ForeignKey
    confidence3 = Column(Float)

    user = relationship("User", back_populates="history", lazy='joined')
    mushroom1 = relationship("Mushroom", foreign_keys=[mushroomID1], back_populates="history")
    mushroom2 = relationship("Mushroom", foreign_keys=[mushroomID2], back_populates="history")
    mushroom3 = relationship("Mushroom", foreign_keys=[mushroomID3], back_populates="history")
