from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import config

class DB():
    def __init__(self):
  
        self._engine = create_engine(
            'mysql+{}://{}:{}@{}/{}?charset=utf8mb4'.format(
                config.database['connector'], config.database['user'], config.database['password'],
                config.database['host'], config.database['db']
            )
        )
  
        self._base = declarative_base()
        self._inspector = inspect(self._engine)
        self._session = sessionmaker(bind=self._engine)
        
db = DB()
