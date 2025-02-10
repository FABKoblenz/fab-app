from datetime import datetime
from typing import List

from fastapi import APIRouter, HTTPException
from fastapi.params import Depends
from sqlalchemy import delete
from sqlmodel import select

from connectors import common_deps, CommonDeps
from models.models import FABCartItem, FABItem

router = APIRouter()


def _get_current_cart(commons: CommonDeps) -> List[FABCartItem]:
    stmt = select(FABCartItem).where(FABCartItem.user_id == commons.user_id)
    result = commons.db.exec(stmt)
    return [r for r in result]


@router.get("/")
def get_cart(commons: CommonDeps = Depends(common_deps)) -> List[FABCartItem]:
    return _get_current_cart(commons)


@router.post("/add-item")
def add_item_to_cart(item_pk: int, quantity: int = 1, commons: CommonDeps = Depends(common_deps)) -> List[FABCartItem]:
    # Ensure that the item exists first
    stmt = select(FABItem).where(FABItem.pk == item_pk)
    fab_item = commons.db.exec(stmt).first()
    if fab_item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    # Check if the current user already has this item in their cart, if so increment the quantity
    # otherwise create it

    stmt = select(FABCartItem).where(FABCartItem.user_id == commons.user_id).where(FABCartItem.fk_item == item_pk)
    cart_item = commons.db.exec(stmt).first()

    if cart_item is None:
        cart_item = FABCartItem(fk_item=item_pk, user_id=commons.user_id, timestamp=datetime.now(), quantity=quantity)
        commons.db.add(cart_item)
        commons.db.commit()
        commons.db.refresh(cart_item)

    else:
        cart_item.timestamp = datetime.now()
        cart_item.quantity += quantity
        commons.db.add(cart_item)
        commons.db.commit()

    return _get_current_cart(commons)


@router.delete("/remove-item")
def remove_item_from_cart(item_pk: int, commons: CommonDeps = Depends(common_deps)) -> List[FABCartItem]:
    # Ensure that the item exists first
    stmt = delete(FABCartItem).where(FABCartItem.fk_item == item_pk).where(FABCartItem.user_id == commons.user_id)
    commons.db.exec(stmt)
    commons.db.commit()
    return _get_current_cart(commons)
