"""some changes

Revision ID: 0141909d5013
Revises: becafb8881a0
Create Date: 2024-04-04 08:47:51.714189

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0141909d5013'
down_revision = 'becafb8881a0'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('messages',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('materials', sa.JSON(), nullable=True),
    sa.Column('text', sa.Text(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('activity_id', sa.Integer(), nullable=True),
    sa.Column('sender_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['activity_id'], ['activities.id'], ),
    sa.ForeignKeyConstraint(['sender_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('messages')
    # ### end Alembic commands ###