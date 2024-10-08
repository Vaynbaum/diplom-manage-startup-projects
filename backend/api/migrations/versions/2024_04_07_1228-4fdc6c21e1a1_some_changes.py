"""some changes

Revision ID: 4fdc6c21e1a1
Revises: a97aabcb4023
Create Date: 2024-04-07 12:28:11.017612

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4fdc6c21e1a1'
down_revision = 'a97aabcb4023'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('posts', 'title')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('posts', sa.Column('title', sa.VARCHAR(length=255), autoincrement=False, nullable=True))
    # ### end Alembic commands ###
