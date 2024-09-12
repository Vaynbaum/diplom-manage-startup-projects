"""Restore

Revision ID: a3818abd93a1
Revises: 
Create Date: 2024-03-07 14:20:09.259722

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a3818abd93a1'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('contacts',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=255), nullable=False),
    sa.Column('icon', sa.String(length=255), nullable=False),
    sa.Column('prefix', sa.String(length=255), nullable=True),
    sa.Column('is_redirect', sa.Boolean(), nullable=True),
    sa.Column('details', sa.JSON(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('group_types',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('regions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('roles',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('tag_levels',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('icon', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('tags',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('cities',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('region_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['region_id'], ['regions.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user_abstracts',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=320), nullable=False),
    sa.Column('avatar', sa.JSON(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('username', sa.String(length=255), nullable=True),
    sa.Column('hashed_password', sa.String(length=1024), nullable=False),
    sa.Column('decoration', sa.JSON(), nullable=True),
    sa.Column('role_id', sa.Integer(), nullable=True),
    sa.Column('firstname', sa.String(length=100), nullable=False),
    sa.Column('lastname', sa.String(length=100), nullable=False),
    sa.ForeignKeyConstraint(['role_id'], ['roles.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('admins',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('is_super', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['id'], ['user_abstracts.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('files',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('owner_id', sa.Integer(), nullable=True),
    sa.Column('details', sa.JSON(), nullable=True),
    sa.ForeignKeyConstraint(['owner_id'], ['user_abstracts.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('city_id', sa.Integer(), nullable=True),
    sa.Column('birthdate', sa.Date(), nullable=True),
    sa.ForeignKeyConstraint(['city_id'], ['cities.id'], ),
    sa.ForeignKeyConstraint(['id'], ['user_abstracts.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('contact_users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('contact_id', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('value', sa.String(length=255), nullable=False),
    sa.ForeignKeyConstraint(['contact_id'], ['contacts.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('groups',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('note', sa.Text(), nullable=True),
    sa.Column('contacts', sa.JSON(), nullable=True),
    sa.Column('avatar', sa.JSON(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('altername', sa.String(length=255), nullable=True),
    sa.Column('decoration', sa.JSON(), nullable=True),
    sa.Column('creater_id', sa.Integer(), nullable=True),
    sa.Column('type_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['creater_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['type_id'], ['group_types.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('altername')
    )
    op.create_table('subscriptions',
    sa.Column('subscriber_id', sa.Integer(), nullable=False),
    sa.Column('favorite_id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['favorite_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['subscriber_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('subscriber_id', 'favorite_id')
    )
    op.create_table('tag_users',
    sa.Column('tag_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('level_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['level_id'], ['tag_levels.id'], ),
    sa.ForeignKeyConstraint(['tag_id'], ['tags.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('tag_id', 'user_id')
    )
    op.create_table('group_roles',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('is_common', sa.Boolean(), nullable=True),
    sa.Column('group_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['group_id'], ['groups.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('group_users',
    sa.Column('group_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('role_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['group_id'], ['groups.id'], ),
    sa.ForeignKeyConstraint(['role_id'], ['group_roles.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('group_id', 'user_id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('group_users')
    op.drop_table('group_roles')
    op.drop_table('tag_users')
    op.drop_table('subscriptions')
    op.drop_table('groups')
    op.drop_table('contact_users')
    op.drop_table('users')
    op.drop_table('files')
    op.drop_table('admins')
    op.drop_table('user_abstracts')
    op.drop_table('cities')
    op.drop_table('tags')
    op.drop_table('tag_levels')
    op.drop_table('roles')
    op.drop_table('regions')
    op.drop_table('group_types')
    op.drop_table('contacts')
    # ### end Alembic commands ###
