"""edit acts

Revision ID: 8370eb21e0fc
Revises: d0d2aece2adf
Create Date: 2024-03-18 11:46:57.300130

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8370eb21e0fc'
down_revision = 'd0d2aece2adf'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('activities', sa.Column('decoration', sa.JSON(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('activities', 'decoration')
    # ### end Alembic commands ###
