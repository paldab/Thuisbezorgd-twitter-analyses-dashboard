from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import pandas as pd
import config


class DB():
    def __init__(self):

        self._engine = create_engine(
            'mysql+{}://{}:{}@{}/{}?charset=utf8mb4'.format(
                config.database['connector'], config.database['user'],
                config.database['password'], config.database['host'],
                config.database['db']
            )
        )

        self._base = declarative_base()
        self._inspector = inspect(self._engine)
        self._session = sessionmaker(bind=self._engine)
        self.session = self._session()

    def filter_users(self, *user_names):
        cn_str = (', '.join("'" + name + "'" for name in user_names))

        return self.call_procedure('filter_users', [cn_str])

    def call_procedure(self, name, params=None):
        if params is None:
            params = []

        connection = self._engine.raw_connection()

        try:
            cursor = connection.cursor()
            # call the stored procedure with the INputs
            cursor.callproc(name, params)

            results = cursor.fetchall()
            column_names_list = [x[0] for x in cursor.description]

            tweets = pd.DataFrame.from_records(results,
                                               columns=column_names_list)

            if pd.api.types.is_datetime64_dtype(tweets['created_at']):
                tweets['created_at'] = tweets['created_at'].dt.strftime(
                    '%a, %d %b %Y %H:%M:%S %Z'
                )

            return tweets
        finally:
            # close the cursor of the pool.
            cursor.close()
            # commit the connection.
            connection.commit()


db = DB()
