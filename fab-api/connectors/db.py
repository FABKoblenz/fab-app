import logging

from sqlmodel import create_engine, Session

from alembic.config import Config
from alembic import command

from configurations import Configurations

LOG = logging.getLogger()

engine = create_engine(Configurations.DATABASE_URL, echo=True)


def run_migrations() -> None:
    script_location = "./alembic"
    LOG.info("Running DB migrations in %r on %r", script_location, Configurations.DATABASE_URL)
    alembic_cfg = Config()
    alembic_cfg.set_main_option("script_location", script_location)
    alembic_cfg.set_main_option("sqlalchemy.url", Configurations.DATABASE_URL)
    command.upgrade(alembic_cfg, "head")


def get_db():
    with Session(engine) as session:
        yield session
