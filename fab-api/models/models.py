from datetime import datetime
from typing import List

from sqlmodel import SQLModel, Field


class FABItemBase(SQLModel):
    name: str
    price: float
    tax_category: str


class FABItem(FABItemBase, table=True):
    pk: int = Field(default=None, nullable=False, primary_key=True)


class FABItemCreate(FABItemBase):
    pass


class FABCartItemBase(SQLModel):
    fk_item: int = Field(default=None, foreign_key="fabitem.pk")
    user_id: str
    timestamp: datetime
    quantity: int


class FABCartItem(FABCartItemBase, table=True):
    pk: int = Field(default=None, nullable=False, primary_key=True)


class FABCartItemReturn(FABCartItemBase):
    pk: int = Field(default=None, nullable=False, primary_key=True)
    name: str
    price: float
    total: float


class FABCartItemCreate(FABCartItemBase):
    pass


class FABOrderBase(SQLModel):
    user_id: str
    timestamp: datetime
    total_price: float


class FABOrder(FABOrderBase, table=True):
    pk: int = Field(default=None, nullable=False, primary_key=True)
    paid: bool = Field(default=False)


class FABOrderCreate(FABOrderBase):
    pass


class FABOrderItemBase(SQLModel):
    fk_order: int = Field(default=None, foreign_key="faborder.pk")
    fk_item: int = Field(default=None, foreign_key="fabitem.pk")
    quantity: int
    cart_timestamp: datetime


class FABOrderItem(FABOrderItemBase, table=True):
    pk: int = Field(default=None, nullable=False, primary_key=True)


class FABOrderItemReturn(FABOrderItemBase):
    pk: int
    name: str
    price: float
    total: float


class FABOrderItemCreate(FABOrderItemBase):
    pass


class FABOrderWithItems(FABOrderBase):
    items: List[FABOrderItemReturn]
