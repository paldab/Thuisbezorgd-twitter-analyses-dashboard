from models.model import Tweet
from models.database import db
from utils.cleaner import clean_tweet, remove_stopwords, stem_tweets
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans, AgglomerativeClustering
from sklearn.metrics import silhouette_score
from scipy.cluster.hierarchy import dendrogram
import matplotlib.pyplot as plt
from wordcloud import WordCloud

tweets = db.session.query(Tweet.text, Tweet.user_screenname).all()

# Create DF and clean the tweets
tweet_df = pd.DataFrame(tweets, columns=['text', 'user'])
tweet_df = clean_tweet(tweet_df)
tweet_df = remove_stopwords(tweet_df)
tweet_df = stem_tweets(tweet_df)

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(tweet_df.text)

features = vectorizer.get_feature_names()


def plot_dendrogram(model, **kwargs):
    # Create linkage matrix and then plot the dendrogram

    # create the counts of samples under each node
    counts = np.zeros(model.children_.shape[0])
    n_samples = len(model.labels_)
    for i, merge in enumerate(model.children_):
        current_count = 0
        for child_idx in merge:
            if child_idx < n_samples:
                current_count += 1  # leaf node
            else:
                current_count += counts[child_idx - n_samples]
        counts[i] = current_count

    linkage_matrix = np.column_stack([model.children_, model.distances_,
                                      counts]).astype(float)

    # Plot the corresponding dendrogram
    dendrogram(linkage_matrix, **kwargs)


model = AgglomerativeClustering(n_clusters=None, affinity='euclidean',
                                distance_threshold=0, linkage='ward')

model = model.fit(X.todense())

plt.title('Hierarchical Clustering Dendrogram')

# Plot the top three levels of the dendrogram
plt.figure(figsize=(24, 9))
plot_dendrogram(model, show_leaf_counts=True)
plt.xlabel('Number of points in node (or index of point if no parenthesis).')
plt.savefig('agglomerative.svg')

clusters = 4
top = 20

kmeans = KMeans(n_clusters=clusters, init='k-means++',
                n_init=1, random_state=1)
kmeans.fit(X)
labels = kmeans.predict(X)

print('Top %d terms per cluster:' % top)

# Get centroid coords
order_centroids = kmeans.cluster_centers_.argsort()[:, ::-1]

print(silhouette_score(X, labels=labels))

for i in range(clusters):
    print('Cluster %d:' % i)

    cluster_list = []

    for ind in order_centroids[i]:
        cluster_list.append(features[ind])
        # print(' %s' % features[ind])

    # Create wordcloud for each cluster
    joined_list = ' '.join(cluster_list)
    wordcloud = WordCloud(width=1000, height=1000,
                          background_color='white').generate(joined_list)

    plt.imshow(wordcloud, interpolation='bilinear')
    plt.axis('off')
    plt.savefig('wordcloud-{}.svg'.format(i))
    print()
