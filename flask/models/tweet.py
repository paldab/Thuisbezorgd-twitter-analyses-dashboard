from sqlalchemy import Column, Integer, String
from sqlalchemy.types import Date, Boolean
from sqlalchemy.orm import relationship
from .database import Base


class Tweet(Base):
    __tablename__ = 'tweet'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    text = Column(String, nullable=False)
    created_at = Column(Date, nullable=False)
    user_id = Column(Integer, index=True, nullable=False)
    user_geo_enabled = Column(Boolean, nullable=False)
    user_screenname = Column(String, nullable=False)
    user_location = Column(String, nullable=False)
    retweet_count = Column(Integer, nullable=False)
    user_verified = Column(Boolean, nullable=False)
    hashtags = relationship('hashtag', secondary='hashtag_tweet')

    def __repr__(self):
        return '<Tweet(user={}, geo_enabled={}, verified={}, text={})>'.format(
            self.user_screenname, self.user_geo_enabled,
            self.user_verified, self.text
        )
