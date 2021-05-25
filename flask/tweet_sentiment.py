from sqlalchemy import text
from models.database import db
from models.model import Tweet
from utils.cleaner import clean_tweet
from pathlib import Path
import pandas as pd
import joblib


def label_sentiment(label):
    if label == 0:
        return "Negative"
    if label == 2:
        return "Positive"
    return "Neutral"

def tweet_sentiment_analysis(target=None):
    test_data = None
    
    if len(target.index) == 0:
        # fetching the tweet data
        statement = text("SELECT text from tweet").columns(Tweet.text)
        tweet_data = getattr(db, "_session")().query(Tweet.text).\
            from_statement(statement).all() 

        fetch_df = clean_tweet(pd.DataFrame(tweet_data, columns=["text"]))
        fetch_df.apply(lambda x:x["text"].strip(), axis=1)
        
        test_data = fetch_df["text"]
    else:
        fetch_df = clean_tweet(pd.DataFrame(target, columns=["text"]))
        fetch_df.apply(lambda x:x["text"].strip(), axis=1)
        test_data = target["text"].to_list()
    
    # loading the vectorizer
    vect_name = open((Path(__file__).parent / "ml-vectorizer/tldf-vectorizer.sav").resolve(), "rb")
    vectorizer = joblib.load(vect_name)
    
    Xtest = vectorizer.transform(test_data)

    # loading the model
    model_name = open((Path(__file__).parent / "ml-models/sentiment-model-gridsearch.sav").resolve(), "rb")
    model = joblib.load(model_name)

    pred = model.predict(Xtest)
    # create a structured dataframe
    df = pd.DataFrame(test_data, columns=["review"])
    df["label"] = pred
    df["sentiment"] = df["label"].apply(lambda x:label_sentiment(x))
    
    return df
