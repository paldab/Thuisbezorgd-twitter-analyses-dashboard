from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import config

engine = create_engine(
    'mysql+mysqldb://{}:{}@{}/{}'.format(
        config.database['user'], config.database['password'],
        config.database['host'], config.database['db']
    )
)

Session = sessionmaker()

Base = declarative_base()
