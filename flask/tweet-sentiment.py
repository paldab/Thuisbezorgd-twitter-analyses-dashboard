from sqlalchemy import text
from models.database import db
from models.model import Hashtag, Tweet
from utils.cleaner import clean_tweet
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd
import joblib

# fetching the tweet data
statement = text("SELECT text from tweet").columns(Tweet.text)
tweet_data = getattr(db, "_session")().query(Tweet.text).\
    from_statement(statement).all()

df = clean_tweet(pd.DataFrame(tweet_data, columns=["text"]))
df.apply(lambda x:x["text"].strip(), axis=1)
test_data = df["text"]

# loading the vectorizer
vect_name = open("ml-vectorizer/tldf-vectorizer.sav", "rb")
vectorizer = joblib.load(vect_name)
Xtest = vectorizer.transform(test_data)

# loading the model
model_name = open("ml-models/sentiment-model-gridsearch.sav", "rb")
model = joblib.load(model_name)

pred = model.predict(Xtest)

print(pred)