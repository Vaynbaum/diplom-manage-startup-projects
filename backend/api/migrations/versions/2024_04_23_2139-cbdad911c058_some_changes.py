"""some changes

Revision ID: cbdad911c058
Revises: c1eac22a657f
Create Date: 2024-04-23 21:39:54.451621

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cbdad911c058'
down_revision = 'c1eac22a657f'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('portfolio_types', sa.Column('details', sa.JSON(), nullable=True))
    op.drop_column('portfolio_types', 'placeholder')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('portfolio_types', sa.Column('placeholder', sa.VARCHAR(length=255), autoincrement=False, nullable=True))
    op.drop_column('portfolio_types', 'details')
    # ### end Alembic commands ###
