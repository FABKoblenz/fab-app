from sqlmodel import SQLModel, Field


class ItemBase(SQLModel):
    name: str
    price: float
    taxes: float


class Item(ItemBase, table=True):
    pk: int = Field(default=None, nullable=False, primary_key=True)


class ItemCreate(ItemBase):
    pass
