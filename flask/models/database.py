from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import config

engine = create_engine(
    'mysql+pymysql://{}:{}@{}/{}?charset=utf8mb4'.format(
        config.database['user'], config.database['password'],
        config.database['host'], config.database['db']
    )
)

Session = sessionmaker(bind=engine)

Base = declarative_base()
