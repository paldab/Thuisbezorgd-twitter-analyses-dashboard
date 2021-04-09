from models.model import Tweet
from models.database import db
from utils.cleaner import clean_tweet, remove_stopwords
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.cluster import KMeans

tweets = db.session.query(Tweet.text).all()

tweet_df = pd.DataFrame(tweets, columns=['text'])
tweet_df = clean_tweet(tweet_df)
tweet_df = remove_stopwords(tweet_df)

vectorizer = TfidfVectorizer(ngram_range=(1, 2))
X = vectorizer.fit_transform(tweet_df.text.values)

# model = KMeans(n_clusters=100, init='k-means++', max_iter=100)
# model.fit(X)

true_k = 5
top = 10

model = KMeans(n_clusters=true_k, init='k-means++', max_iter=200, n_init=1, random_state=1)
model.fit(X)

print("Top %d terms per cluster:" % top)

order_centroids = model.cluster_centers_.argsort()[:, ::-1]
terms = vectorizer.get_feature_names()

for i in range(true_k):
    print("Cluster %d:" % i),
    for ind in order_centroids[i, :top]:
        print(' %s' % terms[ind])
    print()

# model_random = KMeans(n_clusters=100, init='random', max_iter=100)
# model_random.fit(X)
