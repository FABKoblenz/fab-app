import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv(verbose=True)


@dataclass
class Configurations:
    KEYCLOAK_URL: str = os.environ.get("KEYCLOAK_URL", "https://auth.fab.cnidarias.net/auth")
    KEYCLOAK_REALM: str = os.environ.get("KEYCLOAK_REALM", "fab")
    DATABASE_URL: str = os.environ.get("DATABASE_URL", "postgresql+psycopg2://postgres:postgres@localhost:5432/fab")
