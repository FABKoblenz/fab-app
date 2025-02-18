"""Add Items

Revision ID: 132e0bfba9b0
Revises: c994d4560270
Create Date: 2025-01-24 22:13:59.644301

"""

from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "132e0bfba9b0"
down_revision: Union[str, None] = "c994d4560270"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("INSERT INTO fabitem (name, price, tax_category) VALUES ('Wasser 0,7L', 2.5, 'W')")
    op.execute("INSERT INTO fabitem (name, price, tax_category) VALUES ('Apfelschorle 0,5L', 2.0, 'W')")
    op.execute("INSERT INTO fabitem (name, price, tax_category) VALUES ('Cola, Fanta, Mezzo, ... 0,33L', 2.0, 'W')")
    op.execute("INSERT INTO fabitem (name, price, tax_category) VALUES ('Malzbier 0,33L', 2.0, 'W')")
    op.execute("INSERT INTO fabitem (name, price, tax_category) VALUES ('Bier 0,33L', 2.0, 'W')")
    op.execute("INSERT INTO fabitem (name, price, tax_category) VALUES ('Weizen, Weizen Alkoholfrei 0,5L', 3.0, 'W')")
    op.execute("INSERT INTO fabitem (name, price, tax_category) VALUES ('Bier, Radler 0,5L', 3.0, 'W')")
    op.execute("INSERT INTO fabitem (name, price, tax_category) VALUES ('Kaffee, Tee (Tasse)', 1.5, 'W')")
    op.execute("INSERT INTO fabitem (name, price, tax_category) VALUES ('Schokoriegel, Snacks', 1.0, 'W')")
    op.execute("INSERT INTO fabitem (name, price, tax_category) VALUES ('Tagesmiete / Tischemiete', 10.0, 'Z')")


def downgrade() -> None:
    op.execute("TRUNCATE TABLE fabitem")
