from models.model import Hashtag, Tweet
from data import TweetCollector
from models.database import db
from utils.cleaner import clean_tweet, remove_stopwords
from sqlalchemy import text
from flask import Flask, jsonify, request
from flask_cors import CORS
from wordcloud import WordCloud
import nltk
import matplotlib
import matplotlib.pyplot as plt
import pandas as pd
import base64
import json
import textwrap
import twint
import io
import config
import emoji

matplotlib.use('Agg')
app = Flask(__name__)

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

prefix = "/api/v1"

app.config["APPLICATION_ROOT"] = prefix


# basic GET route
@app.route('/welcome', methods=['GET'])
def welcome():
    df = db.filter_users('bootyroll', 'njmidm', 'cat_gaming_', 'vriendenv', 'eetleed', 'voetnootje');

    print(df.head())

    return "Welcome to localhost:5050"


@app.route(f'{prefix}/tweet/subject-count', methods=['GET'])
def subject_count():
    rest_count = db.session.query(Tweet.text).filter(
        Tweet.text.like('%restaurant%')
    ).count()

    # Get the tweets with a rough estimate about the delivery
    delivery = db.session.query(Tweet.text).filter(
        Tweet.text.like('%bezorg%')
    ).all()

    delivery_df = pd.DataFrame(delivery, columns=['text'])

    # Filter out the tweets that actually use the 'bezorg' verb
    filtered_delivery = delivery_df[
        delivery_df['text'].str.contains('.*\s(bezorg\w*)\s.*', case=False)
    ]

    count_dict = {'restaurant': rest_count, 'delivery': len(filtered_delivery)}

    return jsonify(count_dict), 200


@app.route(f'{prefix}/agg-numbers', methods=['GET'])
def agg_numbers():

    type = request.args.get('t', default=None, type=str)[: 11].split('-')
    json_data = []
    
    if 't_t' in type:
        statement = text("SELECT COUNT(id) as total, user_screenname FROM tweet GROUP BY user_screenname ORDER BY total DESC LIMIT 1").\
            columns(Tweet.id.label('total'), Tweet.user_screenname)

        data = getattr(db, '_session')().query(
            Tweet.id.label('total'), Tweet.user_screenname
        ).from_statement(statement).all()

        row_headers = [x for x in data[0].keys()]
        
        for number in data:
            json_data.append(dict(zip(row_headers, number)))

    if 'twt' in type:
        statement = text("SELECT COUNT(id) as total FROM tweet").\
            columns(Tweet.id.label('total'))
        
        data = getattr(db, '_session')().query(
            Tweet.id.label('total')
        ).from_statement(statement).all()

        row_headers = [x for x in data[0].keys()]
        
        for number in data:
            json_data.append(dict(zip(row_headers, number)))

    if 'h' in type:
        statement = text("SELECT COUNT(id) as total FROM hashtag").\
            columns(Hashtag.id.label('total'))

        data = getattr(db, '_session')().query(
            Hashtag.id.label('total')
        ).from_statement(statement).all()

        row_headers = [x for x in data[0].keys()]
        
        for number in data:
            json_data.append(dict(zip(row_headers, number)))

    if 'u'in type:
        statement = text("SELECT COUNT(DISTINCT user_screenname) as total FROM tweet").\
            columns(Tweet.user_screenname.label('total'))

        data = getattr(db, '_session')().query(
            Tweet.user_screenname.label('total')
        ).from_statement(statement).all()

        row_headers = [x for x in data[0].keys()]

        for number in data:
            json_data.append(dict(zip(row_headers, number)))

    return jsonify(json_data), 200

@app.route(f'{prefix}/all-tweets', methods=['GET'])
def all_tweets():
    filter = request.args.get('f', default=None, type=str)

    if filter == 'd':
        statement = text("SELECT id, text, user_screenname, created_at FROM tweet WHERE DATE(created_at) = CURDATE()").\
            columns(Tweet.id, Tweet.text, Tweet.user_screenname, Tweet.created_at)

    if filter == 'w':
        statement = text("SELECT id, text, user_screenname, created_at FROM tweet WHERE WEEK (created_at) >= WEEK(CURDATE()) -1 AND YEAR(created_at) = YEAR(CURDATE())").\
            columns(Tweet.id, Tweet.text, Tweet.user_screenname, Tweet.created_at)

    if filter == 'm':
        statement = text("SELECT id, text, user_screenname, created_at FROM tweet WHERE created_at > NOW() - INTERVAL 1 MONTH ORDER BY created_at").\
            columns(Tweet.id, Tweet.text, Tweet.user_screenname, Tweet.created_at)

    if filter == '*':
        statement = text("SELECT id, text, user_screenname, created_at FROM tweet").\
            columns(Tweet.id, Tweet.text, Tweet.user_screenname, Tweet.created_at)

    tweets = getattr(db, '_session')().query(
        Tweet.id, Tweet.text, Tweet.user_screenname, Tweet.created_at
    ).from_statement(statement).all()

    row_headers = [x for x in tweets[0].keys()]
    row_headers.append('trimmed_text')
    json_data = []

    for tweet in tweets:
        trimmed_text = textwrap.shorten(tweet['text'], width=144,
                                        placeholder="...")

        tweet = (tweet['id'], tweet['text'],
                 tweet['user_screenname'], tweet['created_at'], trimmed_text)

        json_data.append(dict(zip(row_headers, tweet)))

    return jsonify(json_data), 200


@app.route(f'{prefix}/wordcloud', methods=['GET'])
def generate_wordcloud():
    # Check parameters
    background_color = request.args.get('backgroundcolor')
    if background_color == "" or background_color == None:
        background_color = "black"

    # dutch stopwords
    dutch_stopwords = nltk.corpus.stopwords.words("dutch")

    tweets = getattr(db, '_session')().query(Tweet.text).all()
    df = pd.DataFrame(tweets, columns=["text"])

    df = clean_tweet(df)
    df = remove_stopwords(df)

    wc = WordCloud(max_words=1000, stopwords=dutch_stopwords,
                   background_color=background_color).generate(
        " ".join(df["text"]))

    # converting image to base64
    plt.imshow(wc)
    plt.axis("off")

    img = io.BytesIO()
    plt.savefig(img, format="png", bbox_inches ='tight', pad_inches=0)
    img.seek(0)
    img64 = base64.b64encode(img.read())

    # converting bytes to string
    img_to_str = str(img64).split("'")[1]
    json_payload = {"image": img_to_str}

    return jsonify(json_payload), 200

def total_sentiment_tweets():
    pass

if __name__ == '__main__':
    c = twint.Config()
    c.Search = '#thuisbezorgd OR @Thuisbezorgd'
    c.Since = '2020-12-31'
    c.Lang = 'nl'
    c.Store_object = True
    c.Hide_output = False
    # c.Limit = 1

    getattr(db, '_base').metadata.create_all(bind=getattr(db, '_engine'))

    collector = TweetCollector(
        config.twitter['key'], config.twitter['secret'], c
    )
    nltk.download('stopwords')
    # collector.recent_search(getattr(db, 'session'))

    # collector.archive_search(getattr(db, 'session'),
    #                          config.twitter['environment'])
    # collector.twint_search()

    app.run(host='127.0.0.1', port=5000, debug=True)
