from sqlalchemy import text
from models.database import db
from models.model import Tweet
from utils.cleaner import clean_tweet
from sklearn.feature_extraction.text import TfidfVectorizer
from pathlib import Path
import pandas as pd
import joblib

def label_sentiment(label):
    if label == 0:
        return "Negative"
    if label == 2:
        return "Positive"
    return "Neutral"

def tweet_sentiment_analysis():
    # fetching the tweet data
    statement = text("SELECT text from tweet").columns(Tweet.text)
    tweet_data = getattr(db, "_session")().query(Tweet.text).\
        from_statement(statement).all() 

    df = clean_tweet(pd.DataFrame(tweet_data, columns=["text"]))
    df.apply(lambda x:x["text"].strip(), axis=1)
    test_data = df["text"]

    # loading the vectorizer
    vect_name = open((Path(__file__).parent / "ml-vectorizer/tldf-vectorizer.sav").resolve(), "rb")
    vectorizer = joblib.load(vect_name)
    Xtest = vectorizer.transform(test_data)

    # loading the model
    model_name = open((Path(__file__).parent / "ml-models/sentiment-model-gridsearch.sav").resolve(), "rb")
    model = joblib.load(model_name)

    pred = model.predict(Xtest)

    # create a structured dataframe
    df = pd.DataFrame(pred, columns=["label"])
    df["sentiment"] = df["label"].apply(lambda x:label_sentiment(x))
    
    return df