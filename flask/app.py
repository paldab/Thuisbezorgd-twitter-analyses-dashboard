import textwrap
from models.model import Hashtag, Tweet, ProcessedTweet
from data import TweetCollector
from models.database import db
from utils.cleaner import clean_tweet, remove_stopwords
from sqlalchemy import text
from flask import Flask, jsonify, request
from flask_cors import CORS
from wordcloud import WordCloud
from tweet_sentiment import tweet_sentiment_analysis
from utils.stopwords import dutch_stopwords
import matplotlib
import matplotlib.pyplot as plt
import pandas as pd
import base64
import twint
import io
import json
import config
import nltk
import atexit 
from apscheduler.schedulers.background import BackgroundScheduler
from utils.basic_util import create_json

matplotlib.use('Agg')
app = Flask(__name__)

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

prefix = "/api/v1"

app.config["APPLICATION_ROOT"] = prefix


@app.route(f'{prefix}/tweet/subject-count', methods=['GET'])
def subject_count():
    rest_count = db._session().query(Tweet.text).filter(
        Tweet.text.like('%restaurant%')
    ).count()

    # Get the tweets with a rough estimate about the delivery
    delivery = db._session().query(Tweet.text).filter(
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

        data = db._session().query(
            Tweet.id.label('total'), Tweet.user_screenname
        ).from_statement(statement).all()

        json_data += create_json(data)

    if 'twt' in type:
        statement = text("SELECT COUNT(id) as total FROM tweet").\
            columns(Tweet.id.label('total'))

        data = db._session().query(
            Tweet.id.label('total')
        ).from_statement(statement).all()

        json_data += create_json(data)

    if 'h' in type:
        statement = text("SELECT COUNT(id) as total FROM hashtag").\
            columns(Hashtag.id.label('total'))

        data = db._session().query(
            Hashtag.id.label('total')
        ).from_statement(statement).all()

        json_data += create_json(data)

    if 'u' in type:
        statement = text("SELECT COUNT(DISTINCT user_screenname) as total FROM tweet").\
            columns(Tweet.user_screenname.label('total'))

        data = db._session().query(
            Tweet.user_screenname.label('total')
        ).from_statement(statement).all()

        json_data += create_json(data)

    return jsonify(json_data), 200


@app.route(f'{prefix}/tweet', methods=['GET'])
def all_tweets():
    filter = request.args.get('f', default=None, type=str)

    if filter == 'd':
        procedure = 'getDailyTweets'

    if filter == 'w':
        procedure = 'getWeeklyTweets'

    if filter == 'm':
        procedure = 'getMonthlyTweets'

    # Show all Tweets by default
    if filter is None:
        tweets = db._session().query(
            Tweet.id, Tweet.text, Tweet.user_screenname, Tweet.created_at
        ).all()

        json_data = create_json(tweets, True)

    else:

        tweets_df = db.call_procedure(procedure)

        # add trimmed_text to dataframe.
        tweets_df['trimmed_text'] = tweets_df['text'].apply(lambda x: textwrap.shorten(x, width=144, placeholder="..."))

        json_data = json.loads(
            tweets_df.to_json(orient='records', date_format='iso')
        )

    return jsonify(json_data), 200

@app.route(f'{prefix}/agg-numbers-graph', methods=['GET'])
def agg_numbers_graph():

    json_data = []


   
    statement = text("select count(DISTINCT tweet.user_id), DATE(tweet.created_at) from hashtag inner join hashtag_tweet on hashtag_tweet.hashtag_id = hashtag.id inner join tweet on hashtag_tweet.tweet_id = tweet.id where DATE(tweet.created_at) >= DATE_ADD(LAST_DAY(DATE_SUB(NOW(), INTERVAL 2 MONTH)), INTERVAL 1 DAY) and DATE(tweet.created_at) <= DATE_SUB(NOW(), INTERVAL 1 MONTH) group by DATE(tweet.created_at) order by DATE(tweet.created_at);").\
            columns(Tweet.user_screenname, Tweet.created_at)

    data = db._session().query(
            Tweet.user_screenname, Tweet.created_at
        ).from_statement(statement).all()

    json_data += create_json(data)

    return jsonify(json_data), 200



@app.route(f'{prefix}/agg-hastags-graph', methods=['GET'])
def agg_hastags_graph():
    # procedure = 'getMonthlyTweets'
    # tweets_df = db.call_procedure(procedure)

    #     # add trimmed_text to dataframe.
    # tweets_df['trimmed_text'] = tweets_df['text'].apply(lambda x: textwrap.shorten(x, width=144, placeholder="..."))

    # json_data = json.loads(
    #     tweets_df.to_json(orient='records', date_format='iso')
    #     )

    # return jsonify(json_data), 200




    json_data = []

    statement = text("select count(hashtag.id) as hashtag_sum, DATE(tweet.created_at) from hashtag inner join hashtag_tweet on hashtag_tweet.hashtag_id = hashtag.id inner join tweet on hashtag_tweet.tweet_id = tweet.id where DATE(tweet.created_at) >= DATE_ADD(LAST_DAY(DATE_SUB(NOW(), INTERVAL 2 MONTH)), INTERVAL 1 DAY) and DATE(tweet.created_at) <= DATE_SUB(NOW(), INTERVAL 1 MONTH)group by DATE(tweet.created_at) order by DATE(tweet.created_at);").\
            columns(Hashtag.id, Tweet.created_at)

    data = db._session().query(
            Hashtag.id, Tweet.created_at
        ).from_statement(statement).all()

    json_data += create_json(data)

    return jsonify(json_data), 200 

    


@app.route(f'{prefix}/tweet/date', methods=['GET'])
def dateFiltered_tweets():
    startDate = request.args.get('s', default=None, type=str)
    endDate = request.args.get('e', default=None, type=str)

    tweets = db.call_procedure('getTweetsByDatesDiff', [startDate, endDate])
    tweets['trimmed_text'] = tweets['text'].apply(
        lambda x: textwrap.shorten(x, width=144, placeholder="...")
    )

    parsed_json = json.loads(
        tweets.to_json(orient='records', date_format='iso')
    )

    return jsonify(parsed_json), 200





@app.route(f'{prefix}/wordcloud', methods=['GET'])
def generate_wordcloud():
    # Check parameters
    background_color = request.args.get('backgroundcolor')
    if background_color == "" or background_color == None:
        background_color = "black"

    tweets = db._session().query(Tweet.id, Tweet.text, Tweet.created_at).all()
    df = pd.DataFrame(tweets, columns=['id', "text", 'created_at'])

    processed_tweets = db._session().query(
        ProcessedTweet.text, ProcessedTweet.created_at
    ).all()

    processed_df = pd.DataFrame(processed_tweets,
                                columns=['text', 'created_at'])

    newest_tweet = df.created_at.max()
    newest_ptweet = processed_df.created_at.max()

    # Check if newest tweet was already processed
    if processed_df.empty or newest_tweet != newest_ptweet:
        # Only process new tweets to reduce computation
        if not processed_df.empty:
            df = df[df['created_at'] > newest_ptweet]

        df = clean_tweet(df)
        df = remove_stopwords(df)

        df.to_sql(ProcessedTweet.__tablename__, db._engine,
                  if_exists='append', index=False, chunksize=250)
        processed_df = df

    wc = WordCloud(max_words=1000, stopwords=dutch_stopwords,
                   background_color=background_color).generate(
        " ".join(processed_df["text"]))

    # converting image to base64
    plt.imshow(wc)
    plt.axis("off")

    img = io.BytesIO()
    plt.savefig(img, format="png", bbox_inches='tight', pad_inches=0)
    img.seek(0)
    img64 = base64.b64encode(img.read())

    # converting bytes to string
    img_to_str = str(img64).split("'")[1]
    json_payload = {"image": img_to_str}

    return jsonify(json_payload), 200

def run_job():
    print("running task...")
    collector.recent_search(getattr(db, 'session'))

@app.route(f'{prefix}/tweet/sentiment', methods=['GET'])
def total_sentiment_tweets():
    df = tweet_sentiment_analysis()
    return jsonify(df.value_counts().to_json(orient='table')), 200


if __name__ == '__main__':

    scheduler = BackgroundScheduler()

    c = twint.Config()
    c.Search = '#thuisbezorgd OR @Thuisbezorgd'
    c.Since = '2020-12-31'
    c.Lang = 'nl'
    c.Store_object = True
    c.Hide_output = False

    getattr(db, '_base').metadata.create_all(bind=getattr(db, '_engine'))

    collector = TweetCollector(
        config.twitter['key'], config.twitter['secret'], c
    )

    scheduler.add_job(func=run_job, trigger="cron", day_of_week='mon-sun', hour=2, minute=30)
    scheduler.start()

    nltk.download('stopwords')

    # collector.recent_search(db._session())

    # collector.archive_search(db._session(),
    #                          config.twitter['environment'])
    # collector.twint_search()

    app.run(host='127.0.0.1', port=5000, debug=False)

atexit.register(lambda: scheduler.shutdown())
