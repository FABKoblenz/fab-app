from pydantic import BaseModel
from sqlmodel import SQLModel, Field


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class UserBase(SQLModel):
    first_name: str
    last_name: str
    username: str
    email: str | None = None
    disabled: bool | None = None


class User(UserBase, table=True):
    pk: int = Field(default=None, nullable=False, primary_key=True)
    hashed_password: str
    pin: str
