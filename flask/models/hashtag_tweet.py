from sqlalchemy import Column, Integer, ForeignKey
from .database import Base


class HashtagTweet(Base):
    __table__name = 'hashtag_tweet'

    tweet_id = Column(Integer, ForeignKey('tweet.id'), primary_key=True)
    tweet_id = Column(Integer, ForeignKey('hashtag.id'), primary_key=True)
