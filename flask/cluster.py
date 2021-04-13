from models.model import Tweet
from models.database import db
from utils.cleaner import clean_tweet, remove_stopwords
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.cluster import KMeans, AgglomerativeClustering
from sklearn.decomposition import TruncatedSVD
from sklearn.pipeline import make_pipeline
from sklearn.metrics import silhouette_score
import matplotlib.pyplot as plt
from scipy.cluster.hierarchy import linkage, fcluster, dendrogram
import sys
sys.setrecursionlimit(10000)

tweets = db.session.query(Tweet.text).all()

tweet_df = pd.DataFrame(tweets, columns=['text'])
tweet_df = clean_tweet(tweet_df)
tweet_df = remove_stopwords(tweet_df)

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(tweet_df.text)

features = vectorizer.get_feature_names()

# import functools
import numpy as np

nzero_count = 0

# tmp = np.where(np.all(np.isclose(X, 0.), axis=0))
print(X.shape)

for vector in X:
    nonzero = np.count_nonzero(vector.toarray())
    nzero_count += nonzero

    # tmp = np.where(vector == 0)
    # print(tmp, type(tmp))
    # if tmp == 0:
    #     print(zero_count)

#     zero_count += 1

# Z = linkage(X, 'ward')

# cluster = fcluster(Z, 0.9, criterion='distance')

# plt.figure()
# dn = dendrogram(Z, show_leaf_counts=True)
# plt.show()

# model = AgglomerativeClustering(n_clusters=None, affinity='cosine',
#                                 distance_threshold=0, linkage='single')

# cluster = model.fit(X.toarray())

# # Create a TruncatedSVD instance: svd
# svd = TruncatedSVD(n_components=50)

# # Create a KMeans instance: kmeans
# kmeans = KMeans(n_clusters=6, random_state=0)

# # Create a pipeline: pipeline
# pipeline = make_pipeline(svd, kmeans)

# pipeline.fit(X)

# labels = pipeline.predict(X)
# model = KMeans(n_clusters=6, init='k-means++', random_state=0)
# model.fit(X)
# labels = model.predict(X)
# print(labels)

# ks = range(1, 20)
# inertias = []

# for k in ks:
#     model = KMeans(n_clusters=k)
#     model.fit(X)

#     inertias.append(model.inertia_)

# plt.plot(ks, inertias, '-o')
# plt.xlabel('number of clusters, k')
# plt.ylabel('inertia')
# plt.xticks(ks)
# plt.show()

# true_k = 5
# top = 10

# model = KMeans(n_clusters=true_k, init='k-means++', max_iter=200,
#                n_init=1, random_state=1)
# model.fit(X)
# labels = model.predict(X)

# print("Top %d terms per cluster:" % top)

# order_centroids = model.cluster_centers_.argsort()[:, ::-1]

# print(silhouette_score(X, labels=labels))

# for i in range(true_k):
#     print("Cluster %d:" % i)

#     for ind in order_centroids[i, :top]:
#         print(' %s' % features[ind])
#     print()

# model_random = KMeans(n_clusters=100, init='random', max_iter=100)
# model_random.fit(X)
# Hierarchical cluster
# Dendogram
