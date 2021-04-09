from models.model import Tweet
from models.database import db
from utils.cleaner import clean_tweet, remove_stopwords
import pandas as pd
from sklearn.cluster import KMeans

tweets = db.session.query(Tweet.text).all()

tweet_df = pd.DataFrame(tweets, columns=['text'])
tweet_df = clean_tweet(tweet_df)
tweet_df = remove_stopwords(tweet_df)

print(tweet_df['text'].iloc[10])
