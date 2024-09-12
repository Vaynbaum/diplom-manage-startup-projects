"""some changes

Revision ID: 7a640061c74c
Revises: 994be5318665
Create Date: 2024-03-31 09:56:37.361564

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7a640061c74c'
down_revision = '994be5318665'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('activity_statuses', sa.Column('is_change', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('activity_statuses', 'is_change')
    # ### end Alembic commands ###
