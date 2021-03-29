import twint
import config
import tweepy
from models.database import db
from models import model
from datetime import datetime


class TweetCollector():
    def __init__(self, api_key, api_secret, twint_config=twint.Config()):
        self.auth = tweepy.OAuthHandler(api_key, api_secret)
        self.api = tweepy.API(self.auth)
        self.twint_config = twint_config

    def twint_search(self):
        twint.run.Search(self.twint_config)
        tweet_list = twint.output.tweets_list

        for item in tweet_list:
            created_at = datetime.strptime(
                item.datestamp + " " + item.timestamp,
                '%Y-%m-%d %H:%M:%S'
            )

            tweet = model.Tweet(
                id=item.id_str, text=item.tweet, created_at=created_at,
                user_id=item.user_id, user_geo_enabled=False,
                user_screenname=item.username, user_location=None,
                retweet_count=item.retweets_count, user_verified=False
            )

            tweet.hashtags.extend(
                self.get_hashtags_list(getattr(db, '_session')(), item.hashtags)
            )

            getattr(db, '_session')().merge(tweet)
            getattr(db, '_session')().commit()

    def insert_tweets(self, item, session):
        if item.geo is None:
            location = item.geo
        else:
            # coordinates are represented in a list as: [lat, long]
            location = ' '.join(map(str, item.geo['coordinates']))

        tweet = model.Tweet(
            id=item.id_str, text=item.full_text, created_at=item.created_at,
            user_id=item.user.id, user_geo_enabled=item.user.geo_enabled,
            user_screenname=item.user.screen_name, user_location=location,
            retweet_count=item.retweet_count, user_verified=item.user.verified
        )

        tweet.hashtags.extend(
            self.get_hashtags_list(session, item.entities['hashtags'])
        )

        session.merge(tweet)
        session.commit()

    def get_hashtags_list(self, session, hashtags):
        tags = []
        unique_names = set()

        if hashtags:
            for tag in hashtags:
                # Check if we are dealing with Tweepy or Twint data types
                text = tag['text'] if isinstance(tag, dict) else tag
                hashtag = model.Hashtag(name=text)

                q = session.query(model.Hashtag.id).filter(
                    model.Hashtag.name == text
                )

                # Set id of Hastag when existing is found
                if session.query(q.exists()).scalar():
                    hashtag.id = q.first()[0]

                # Extra check to prevent integrity errors. No duplicates..
                if text not in unique_names:
                    unique_names.add(text)
                    tags.append(hashtag)

        return tags

    def archive_search(self, session, env):
        # TODO: Add FromDate - ToDate
        
        cursor = tweepy.Cursor(
            self.api.search_full_archive,
            environment_name=env,
            query='@Thuisbezorgd OR #thuisbezorgd'
        )

        for item in cursor.items():
            self.insert_tweets(item, session)

    def recent_search(self, session):

        cursor = tweepy.Cursor(
            self.api.search,
            q='@Thuisbezorgd OR #thuisbezorgd',
            lang='nl'
        )

        for item in cursor.items():
            self.insert_tweets(item, session)
