import config
import twint
import tweepy
from models.database import Session, engine
from models import model


class TweetCollector():
    def __init__(self, api_key, api_secret, twint_config=twint.Config()):
        self.auth = tweepy.OAuthHandler(api_key, api_secret)
        self.api = tweepy.API(self.auth)
        self.twint_config = config

    def twint_search(self):
        twint.run.Search(self.twint_config)

        if self.twint_config.Pandas:
            return twint.storage.panda.Tweets_df

    def insert_tweets(self, item, session):
        if item.geo is None:
            location = item.geo
        else:
            # coordinates are represented in a list as: [lat, long]
            location = ' '.join(map(str, item.geo['coordinates']))

        tweet = model.Tweet(
            text=item.text, created_at=item.created_at,
            user_id=item.user.id, user_geo_enabled=item.user.geo_enabled,
            user_screenname=item.user.screen_name, user_location=location,
            retweet_count=item.retweet_count,
            user_verified=item.user.verified
        )

        hashtags = item.entities['hashtags']

        if hashtags:
            for tag in hashtags:
                hashtag = model.Hashtag(name=tag['text'])
                q = session.query(model.Hashtag.id).filter(
                    model.Hashtag.name == tag['text']
                )

                # Set id of Hastag when existing is found
                if session.query(q.exists()).scalar():
                    hashtag.id = q.first()[0]

                tweet.hashtags.append(hashtag)

            session.merge(tweet)
            session.commit()

    def archive_search(self, session, env):
        cursor = tweepy.Cursor(self.api.search_full_archive,
                               environment_name=env,
                               query='@Thuisbezorgd OR #thuisbezorgd')

        for item in cursor.items():
            self.insert_tweets(item, session)

    def recent_search(self, session):
        cursor = tweepy.Cursor(self.api.search,
                               q='@Thuisbezorgd OR #thuisbezorgd', lang='nl')

        for item in cursor.items():
            self.insert_tweets(item, session)


session = Session()
c = twint.Config()

model.Base.metadata.create_all(bind=engine)
collector = TweetCollector(config.twitter['key'], config.twitter['secret'])
collector.recent_search(session)
# collector.archive_search(session, config.twitter['environment'])

c.Search = '#thuisbezorgd'
c.Since = '2020-12-31'
c.Lang = 'nl'
c.Pandas = True
# c.Output = 'tweets.csv'
