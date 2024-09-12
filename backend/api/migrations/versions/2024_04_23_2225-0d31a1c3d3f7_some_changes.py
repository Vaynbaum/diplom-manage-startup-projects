"""some changes

Revision ID: 0d31a1c3d3f7
Revises: cbdad911c058
Create Date: 2024-04-23 22:25:30.807539

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0d31a1c3d3f7'
down_revision = 'cbdad911c058'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('portfolios_type_id_fkey', 'portfolios', type_='foreignkey')
    op.create_foreign_key(None, 'portfolios', 'portfolio_types', ['type_id'], ['id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'portfolios', type_='foreignkey')
    op.create_foreign_key('portfolios_type_id_fkey', 'portfolios', 'post_types', ['type_id'], ['id'])
    # ### end Alembic commands ###