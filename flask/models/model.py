from sqlalchemy import Table, Column, Integer, String, ForeignKey
from sqlalchemy.types import DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from .database import Base

hashtag_tweet = Table(
    'hashtag_tweet', Base.metadata,
    Column('tweet_id', String(255), ForeignKey('tweet.id')),
    Column('hashtag_id', Integer, ForeignKey('hashtag.id'))
)


class Tweet(Base):
    __tablename__ = 'tweet'

    id = Column(String(255), primary_key=True, index=True)
    text = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False)
    user_id = Column(String(255), index=True, nullable=False)
    user_geo_enabled = Column(Boolean, nullable=False)
    user_screenname = Column(String(50), nullable=False)
    user_location = Column(String(50))
    retweet_count = Column(Integer, nullable=False)
    user_verified = Column(Boolean, nullable=False)
    emoji = Column(String(255))

    hashtags = relationship('Hashtag', secondary=hashtag_tweet,
                            back_populates='tweets')

    def __repr__(self):
        return '<Tweet(user={}, geo_enabled={}, verified={}, text={})>'.format(
            self.user_screenname, self.user_geo_enabled,
            self.user_verified, self.text
        )


class Hashtag(Base):
    __tablename__ = 'hashtag'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(150), nullable=False, unique=True)

    tweets = relationship('Tweet', secondary=hashtag_tweet,
                          back_populates='hashtags')

    def __repr__(self):
        return '<Hashtag(id={}, name={})>'.format(self.id, self.name)
