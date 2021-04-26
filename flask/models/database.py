from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import pandas as pd
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
        self.session = self._session()

    def filter_cucks(self, *cuck_names):
        cn_str = (', '.join("'" + cuck + "'" for cuck in cuck_names))
        connection = self._engine.raw_connection()
        cursor = connection.cursor()
        # call the stored procedure with the INputs
        cursor.callproc("filter_cucks", [cn_str])
        column_names_list = [x[0] for x in cursor.description]
        # setup tweets with column_names
        tweets = [dict(zip(column_names_list, row)) for row in cursor.fetchall()]
        # turn reviews JSON array to pandas Dataframe
        tweets = pd.DataFrame(tweets, columns=column_names_list)
        # close the cursor of the pool.
        cursor.close()
        # commit the connection.
        connection.commit()

        return tweets


db = DB()
