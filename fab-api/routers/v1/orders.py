from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select

from connectors import common_deps, CommonDeps
from models.models import FABCartItem, FABOrder, FABOrderItem, FABOrderWithItems, FABItem, FABOrderItemReturn

router = APIRouter()


def _get_orders(commons: CommonDeps = Depends(common_deps)):
    pass


def get_order_details(order_id: int, commons: CommonDeps = Depends(common_deps)) -> FABOrderWithItems:
    stmt = (
        select(FABOrder, FABOrderItem, FABItem)
        .join(FABOrderItem)
        .join(FABItem)
        .where(FABOrder.pk == order_id)
        .where(FABOrder.user_id == commons.user_id)
    )
    result = commons.db.exec(stmt)
    user_id = None
    timestamp = None
    total_price = None
    items = []
    for order, order_item, item in result:
        user_id = order.user_id
        timestamp = order.timestamp
        total_price = order.total_price
        items.append(
            FABOrderItemReturn(
                **order_item.model_dump(),
                name=item.name,
                price=item.price,
                total_price=order_item.quantity * item.price
            )
        )
    return FABOrderWithItems(user_id=user_id, timestamp=timestamp, total_price=total_price, items=items)


@router.get("/")
async def get_orders(commons: CommonDeps = Depends(common_deps)) -> List[FABOrder]:
    stmt = select(FABOrder).where(FABOrder.user_id == commons.user_id).order_by(FABOrder.timestamp.desc())
    result = commons.db.exec(stmt)
    return [r for r in result]


@router.get("/deltails")
async def get_orders_deltails(order_id: int, commons: CommonDeps = Depends(common_deps)):
    return get_order_details(order_id, commons)


@router.post("/order-cart")
async def create_order_cart(commons: CommonDeps = Depends(common_deps)) -> FABOrderWithItems:
    stmt = select(FABCartItem).where(FABCartItem.user_id == commons.user_id)
    result = commons.db.exec(stmt)

    all_cart_items = [r for r in result]
    if len(all_cart_items) == 0:
        raise HTTPException(status_code=400, detail="Cannot Order an Empty Cart!")

    total_price = 0
    for item in all_cart_items:
        i_stmt = select(FABItem).where(FABItem.pk == item.fk_item)
        i_result = commons.db.exec(i_stmt).first()
        total_price += i_result.price * item.quantity

    fab_order = FABOrder(user_id=commons.user_id, timestamp=datetime.now(), total_price=total_price)
    commons.db.add(fab_order)
    commons.db.commit()
    commons.db.refresh(fab_order)

    for item in all_cart_items:
        fab_order_item = FABOrderItem(fk_order=fab_order.pk, fk_item=item.fk_item, quantity=item.quantity)
        commons.db.add(fab_order_item)
        commons.db.delete(item)
    commons.db.commit()
    commons.db.refresh(fab_order)

    return get_order_details(fab_order.pk, commons)
