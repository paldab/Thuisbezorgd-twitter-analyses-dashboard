from models.model import Tweet
from data import TweetCollector
from models.database import db
from sqlalchemy import text
from flask import Flask, jsonify, request
from flask_cors import CORS
import textwrap
import twint
import config
import pandas as pd


app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


# basic GET route
@app.route('/welcome/', methods=['GET'])
def welcome():
    return "Welcome to localhost:5050"


# GET route with param
@app.route('/person/<name>', methods=['GET'])
def test(name):
    return 'Hello ' + name

# GET route with multiple params and JSON response with 418 status code
@app.route('/api/v1/all-tweets', methods=['GET'])
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
