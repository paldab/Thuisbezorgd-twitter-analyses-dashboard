from models.model import Tweet
from data import TweetCollector
from models.database import db
from sqlalchemy import text
from flask import Flask, jsonify, request
from flask_cors import CORS
from wordcloud import WordCloud
from nltk.corpus import stopwords
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
@app.route('/welcome/', methods=['GET'])
def welcome():
    return "Welcome to localhost:5050"


# GET route with param
@app.route('/person/<name>', methods=['GET'])
def test(name):
    tweets = db.session.query(Tweet.text).all()

    tweet_df = pd.DataFrame(tweets, columns=['text'])
    tweet_df['text'] = tweet_df['text'].str.replace(emoji.get_emoji_regexp(),
                                                    '', regex=True)

    tweet_df['text'] = tweet_df['text'].str.replace(r'#(\w+)',
                                                    '', regex=True)

    print(tweet_df['text'].tail())
    return tweet_df['text'].iloc[2]



# GET route with multiple params and JSON response with 418 status code
@app.route(f'{prefix}/all-tweets', methods=['GET'])
def all_tweets():
    filter = request.args.get('f', default=None, type=str)

    if filter == 'd':
        statement = text("SELECT id, text, user_screenname, created_at FROM tweet WHERE DATE(created_at)=CURDATE()").\
            columns(Tweet.id, Tweet.text, Tweet.user_screenname, Tweet.created_at)

    if filter == 'w':
        statement = text("SELECT id, text, user_screenname, created_at FROM tweet WHERE WEEK (created_at) >= WEEK(CURDATE()) -1 AND YEAR(created_at) = YEAR(CURDATE())").\
            columns(Tweet.id, Tweet.text, Tweet.user_screenname, Tweet.created_at)

    if filter == 'm':
        statement = text("SELECT id, text, user_screenname, created_at FROM tweet WHERE created_at > NOW() - INTERVAL 1 MONTH;").\
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
    dutch_stopwords = stopwords.words("dutch")

    tweets = getattr(db, '_session')().query(Tweet.text).all()
    df = pd.DataFrame(tweets, columns=["text"])

    wc = WordCloud(max_words=1000, stopwords=dutch_stopwords,
                   background_color=background_color).generate(
        " ".join(df["text"]))

    # converting image to base64
    plt.imshow(wc)
    plt.axis("off")

    img = io.BytesIO()
    plt.savefig(img, format="png")
    img.seek(0)
    img64 = base64.b64encode(img.read())

    # converting bytes to string
    img_to_str = str(img64).split("'")[1]
    print(img_to_str)
    json_payload = {"image": img_to_str}

    return jsonify(json_payload), 200


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
    # collector.recent_search(getattr(db, 'session'))

    # collector.archive_search(getattr(db, 'session'),
    #                          config.twitter['environment'])
    # collector.twint_search()

    app.run(host='127.0.0.1', port=5000, debug=True)
