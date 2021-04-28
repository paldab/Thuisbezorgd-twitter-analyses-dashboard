from utils.stopwords import dutch_stopwords as stopwords
from sklearn.cluster import KMeans
from nltk.stem import WordNetLemmatizer, SnowballStemmer
from gensim.utils import simple_preprocess
import nltk
import pandas as pd
import gensim

nltk.download('wordnet')
stemmer = SnowballStemmer("dutch")

def lemmatize_stemming(text):
    return stemmer.stem(WordNetLemmatizer().lemmatize(text, pos="v"))

def preprocess(text):
    return [lemmatize_stemming(token) for token in simple_preprocess(text)
            if token not in stopwords and len(token) > 3]

df = pd.read_parquet("sentiment/dutch-restaurant-reviews.parquet", engine="pyarrow")

df["text"] = df["reviewText"]
# remove stopwords
preprocess_data = df["text"].map(preprocess)
print("done")


w2vec = gensim.models.Word2Vec(preprocess_data, vector_size=100, window=3, workers=6, epochs=3, min_count=1)
kmeans = KMeans(n_clusters=2).fit(X=w2vec.wv.vectors)

print(w2vec.wv.key_to_index)
print(w2vec.wv.vectors)

positive_cluster = kmeans.cluster_centers_[0]
negative_cluster = kmeans.cluster_centers_[1]

vector_df = pd.DataFrame(w2vec.wv.key_to_index.keys())
print(vector_df.head())

print(w2vec.wv.similar_by_vector(negative_cluster, topn=10))

