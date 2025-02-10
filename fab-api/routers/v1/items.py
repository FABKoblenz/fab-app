from typing import List

from fastapi import APIRouter, Depends
from sqlmodel import select

from connectors import common_deps, CommonDeps
from connectors.user_service import auth_requires
from models.models import FABItem, FABItemCreate

router = APIRouter()


@router.get("/")
async def get_items(commons: CommonDeps = Depends(common_deps)) -> List[FABItem]:
    stmt = select(FABItem)
    result = commons.db.exec(stmt)
    return [r for r in result]


@router.post("/create")
@auth_requires("fab-admin")
async def create_item(item: FABItemCreate, commons: CommonDeps = Depends(common_deps)) -> FABItem:
    db_item = FABItem(**item.model_dump())
    commons.db.add(db_item)
    commons.db.commit()
    commons.db.refresh(db_item)
    return db_item
