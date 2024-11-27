from pydantic import BaseModel


class MushroomSchema(BaseModel):
    mushroomID: int
    commonName: str
    scientificName: str
    description: str
    edibility: str

    class Config:
        from_attributes = True


class MushroomSchemaCreate(BaseModel):
    commonName: str
    scientificName: str
    description: str
    edibility: str