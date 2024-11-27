from db import Base
from sqlalchemy import Column, Integer, String, DateTime, BLOB, Float, ForeignKey
from sqlalchemy.orm import relationship

class Mushroom(Base):
    __tablename__ = "mushrooms"

    mushroomID = Column(Integer, primary_key=True, index=True)
    commonName = Column(String)
    scientificName = Column(String)
    description = Column(String)
    edibility = Column(String)
    history = relationship("History",
                           foreign_keys="[History.mushroomID1, History.mushroomID2, History.mushroomID3]",
                           back_populates="mushroom1",
                           primaryjoin="or_(Mushroom.mushroomID==History.mushroomID1, "
                                       "Mushroom.mushroomID==History.mushroomID2, "
                                       "Mushroom.mushroomID==History.mushroomID3)")