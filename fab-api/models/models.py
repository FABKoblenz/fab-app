from datetime import datetime
from typing import List, Optional

from sqlmodel import SQLModel, Field


class FABItemBase(SQLModel):
    name: str
    price: float
    tax_category: str
    tax_rate: int


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
    fk_invoice: Optional[int] = Field(default=None, foreign_key="fabinvoice.pk", nullable=True)


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
    tax_rate: int


class FABOrderItemCreate(FABOrderItemBase):
    pass


class FABOrderWithItems(FABOrderBase):
    items: List[FABOrderItemReturn]


class FABInvoiceBase(SQLModel):
    invoice_number: int
    invoice_date: datetime
    invoice_html: str


class FABInvoice(FABInvoiceBase, table=True):
    pk: int = Field(default=None, nullable=False, primary_key=True)


class FABUserInfoBase(SQLModel):
    user_id: str
    first_name: str
    last_name: str
    street: str
    zip: str
    city: str


class FABUserInfo(FABUserInfoBase, table=True):
    pk: int = Field(default=None, nullable=False, primary_key=True)
