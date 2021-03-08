from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .database import Base
from .tweet import Tweet


class Hashtag(Base):
    __tablename__ = 'hashtag'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    tweets = relationship(Tweet, secondary='hashtag_tweet')

    def __repr__(self):
        return '<Hashtag(id={}, name={})>'.format(self.id, self.name)
