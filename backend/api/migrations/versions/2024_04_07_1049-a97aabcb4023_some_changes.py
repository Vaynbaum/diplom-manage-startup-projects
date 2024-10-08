"""some changes

Revision ID: a97aabcb4023
Revises: 70c392f1b0a7
Create Date: 2024-04-07 10:49:32.429199

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a97aabcb4023'
down_revision = '70c392f1b0a7'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('post_types',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.drop_table('post_names')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('post_names',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('name', sa.VARCHAR(length=255), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('id', name='post_names_pkey'),
    sa.UniqueConstraint('name', name='post_names_name_key')
    )
    op.drop_table('post_types')
    # ### end Alembic commands ###
