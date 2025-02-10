import os
import logging

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.routing import APIRouter
from starlette.middleware.cors import CORSMiddleware
import uvicorn

from connectors.db import run_migrations
from routers.v1 import users

logging.basicConfig(level=logging.INFO)


@asynccontextmanager
async def lifespan(_: FastAPI):
    run_migrations()
    yield


# The description supports markdown hence the way this is formatted
description = """
An API to power the Billard Team FAB Koblenz e.V. app

* * * * * * * * * *
### Copyright
Billard Team FAB Koblenz e.V.
"""

app = FastAPI(
    root_path=os.getenv("API_ROOT_PATH", "/"),
    title="Billard Team FAB Koblenz e.V. API",
    description=description,
    contact={
        "name": "Pascal Roessner",
        "url": "https://billardteam-fab.de/",
        "email": "info@billardteam-fab.de",
    },
    version="1",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

v1_api_router = APIRouter()
v1_api_router.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(v1_api_router, prefix="/v1")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
