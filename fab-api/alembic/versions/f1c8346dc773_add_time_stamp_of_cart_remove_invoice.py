"""Add time stamp of cart, remove invoice

Revision ID: f1c8346dc773
Revises: 33082a936b3a
Create Date: 2025-02-16 11:44:31.517541

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "f1c8346dc773"
down_revision: Union[str, None] = "33082a936b3a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column("faborder", "paid", existing_type=sa.BOOLEAN())
    op.drop_column("faborder", "invoice_date")
    op.drop_column("faborder", "invoice_str")
    op.drop_column("faborder", "invoice_number")
    op.add_column("faborderitem", sa.Column("cart_timestamp", sa.DateTime()))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("faborderitem", "cart_timestamp")
    op.add_column("faborder", sa.Column("invoice_number", sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column("faborder", sa.Column("invoice_str", sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column("faborder", sa.Column("invoice_date", postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
    op.alter_column("faborder", "paid", existing_type=sa.BOOLEAN(), nullable=True)
    # ### end Alembic commands ###
