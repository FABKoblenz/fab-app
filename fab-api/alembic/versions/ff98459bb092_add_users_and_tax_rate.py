"""Add Users and tax_rate

Revision ID: ff98459bb092
Revises: 9fe6a6757807
Create Date: 2025-02-18 11:26:24.370542

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "ff98459bb092"
down_revision: Union[str, None] = "9fe6a6757807"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("fabitem", sa.Column("tax_rate", sa.Integer(), nullable=True))
    op.execute("UPDATE fabitem SET tax_rate = 19")
    op.alter_column("fabitem", "tax_rate", nullable=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("fabitem", "tax_rate")
    # ### end Alembic commands ###
