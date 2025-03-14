"""add paid to invoice table

Revision ID: e5a68fd5cdae
Revises: 7c78c62190e8
Create Date: 2025-03-02 13:38:37.452450

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "e5a68fd5cdae"
down_revision: Union[str, None] = "7c78c62190e8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("fabinvoice", sa.Column("paid", sa.Boolean(), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("fabinvoice", "paid")
    # ### end Alembic commands ###
