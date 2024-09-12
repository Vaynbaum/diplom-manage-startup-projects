"""some changes

Revision ID: 92af4174996c
Revises: 5158d5a6431d
Create Date: 2024-03-24 16:41:10.334706

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '92af4174996c'
down_revision = '5158d5a6431d'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('requests')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('requests',
    sa.Column('group_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('activity_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('status_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('created_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['activity_id'], ['activities.id'], name='requests_activity_id_fkey'),
    sa.ForeignKeyConstraint(['group_id'], ['groups.id'], name='requests_group_id_fkey'),
    sa.ForeignKeyConstraint(['status_id'], ['requets_statuses.id'], name='requests_status_id_fkey')
    )
    # ### end Alembic commands ###
