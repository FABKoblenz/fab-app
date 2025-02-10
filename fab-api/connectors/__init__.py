from dataclasses import dataclass

from fastapi.params import Security, Depends
from sqlmodel import Session

from connectors.db import get_db
from connectors.user_service import get_current_user


@dataclass
class CommonDeps:
    user: dict
    user_id: str
    db: Session


def common_deps(user: dict = Security(get_current_user), db: Session = Depends(get_db)) -> CommonDeps:
    return CommonDeps(user=user, user_id=user["sub"], db=db)
