"""some changes

Revision ID: 5b82fb9c735a
Revises: 5bafa7dc8174
Create Date: 2024-03-19 20:05:07.732623

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '5b82fb9c735a'
down_revision = '5bafa7dc8174'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('requets_statuses',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.drop_table('activity_groups')
    op.drop_table('activity_link_statuses')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('activity_link_statuses',
    sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('activity_link_statuses_id_seq'::regclass)"), autoincrement=True, nullable=False),
    sa.Column('name', sa.VARCHAR(length=255), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('id', name='activity_link_statuses_pkey'),
    sa.UniqueConstraint('name', name='activity_link_statuses_name_key'),
    postgresql_ignore_search_path=False
    )
    op.create_table('activity_groups',
    sa.Column('group_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('activity_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('created_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('status_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['activity_id'], ['activities.id'], name='activity_groups_activity_id_fkey'),
    sa.ForeignKeyConstraint(['group_id'], ['groups.id'], name='activity_groups_group_id_fkey'),
    sa.ForeignKeyConstraint(['status_id'], ['activity_link_statuses.id'], name='activity_groups_status_id_fkey'),
    sa.PrimaryKeyConstraint('group_id', 'activity_id', name='activity_groups_pkey')
    )
    op.drop_table('requets_statuses')
    # ### end Alembic commands ###
