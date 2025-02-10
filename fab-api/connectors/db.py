import logging
import os

from sqlmodel import create_engine, Session

from alembic.config import Config
from alembic import command

LOG = logging.getLogger()

DATABASE_URL = str(os.environ.get("DATABASE_URL"))

engine = create_engine(DATABASE_URL, echo=True)


def run_migrations() -> None:
    script_location = "./alembic"
    LOG.info("Running DB migrations in %r on %r", script_location, DATABASE_URL)
    alembic_cfg = Config()
    alembic_cfg.set_main_option("script_location", script_location)
    alembic_cfg.set_main_option("sqlalchemy.url", DATABASE_URL)
    command.upgrade(alembic_cfg, "head")


def get_session():
    with Session(engine) as session:
        yield session
