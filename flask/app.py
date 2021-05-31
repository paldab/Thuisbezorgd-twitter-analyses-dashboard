import textwrap
from models.model import Hashtag, Tweet, ProcessedTweet, hashtag_tweet
from data import TweetCollector
from models.database import db
from utils.cleaner import clean_tweet, remove_stopwords
from sqlalchemy import text, func, desc
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
    date_filter = request.args.get('date', default=None, type=str)
    filter = request.args.get('f', default=None, type=str)
    procedure = db.get_procedure_name(filter)

    df_columns = ["id", "text"]

    if procedure is None:
        all_data = db.session.query(Tweet.id, Tweet.text)

        restaurant_data = db.session.query(Tweet.id, Tweet.text).filter(
            Tweet.text.like('%restaurant%')
        )

        # Get the tweets with a rough estimate about the delivery
        delivery = db._session().query(Tweet.id, Tweet.text).filter(
            Tweet.text.like('%bezorg%')
        )

        if date_filter:
            all_data = all_data.filter(Tweet.get_day_filter(date_filter))

            restaurant_data = restaurant_data.filter(
                Tweet.get_day_filter(date_filter)
            )

            delivery = delivery.filter(Tweet.get_day_filter(date_filter))

        delivery_df = pd.DataFrame(delivery.all(), columns=df_columns)
        restaurant_df = pd.DataFrame(restaurant_data.all(), columns=df_columns)
        all_data_df = pd.DataFrame(all_data.all(), columns=df_columns)

        # Filter out the tweets that actually use the 'bezorg' verb
        filtered_delivery = delivery_df[
            delivery_df['text'].str.contains('.*\s(bezorg\w*)\s.*', case=False)
        ]
    else:
        all_data_df = db.call_procedure(procedure)

        restaurant_df = all_data_df[all_data_df['text'].str.contains('restaurant', case=False)]
        filtered_delivery = all_data_df[
            all_data_df['text'].str.contains('.*\s(bezorg\w*)\s.*', case=False)
        ]

    combined_df = pd.concat([all_data_df, restaurant_df, filtered_delivery])
    all_df = combined_df.drop_duplicates(subset=['id'], keep=False)

    # labeled data
    labeled_all = tweet_sentiment_analysis(all_df)
    # Can't process an empty DataFrame.
    labeled_delivery = tweet_sentiment_analysis(filtered_delivery) if not filtered_delivery.empty else filtered_delivery
    labeled_restaurant = tweet_sentiment_analysis(restaurant_df) if not restaurant_df.empty else restaurant_df

    # json transformed data
    restaurant_data_json = labeled_restaurant.to_json(orient="records")
    all_data_json = labeled_all.to_json(orient="records")
    delivery_data_json = labeled_delivery.to_json(orient="records")

    count_dict = {
        'restaurant': len(labeled_restaurant),
        'delivery': len(filtered_delivery),
        'restaurant_data': restaurant_data_json,
        'delivery_data': delivery_data_json,
        'remaining': len(labeled_all),
        'remaining_data': all_data_json,
    }

    return jsonify(count_dict), 200

@app.route(f'{prefix}/agg-numbers', methods=['GET'])
def agg_numbers():
    date_filter = request.args.get('date', default=None, type=str)
    filter = request.args.get('f', default=None, type=str)
    type = request.args.get('t', default=None, type=str)[: 11].split('-')
    json_data = []

    if 't_t' in type:
        data = db._session().query(
            func.count(Tweet.id).label('total'), Tweet.user_screenname
        ).group_by(Tweet.user_screenname).order_by(
            desc(func.count(Tweet.id).label('total'))
        )

        if date_filter:
            data = data.filter(Tweet.get_day_filter(date_filter))

        if filter:
            data = Tweet.get_filter_by_param(query=data, param=filter)

        json_data += create_json(data.limit(1).all())

    if 'twt' in type:
        data = db._session().query(func.count(Tweet.id).label('total'))

        if date_filter:
            data = data.filter(Tweet.get_day_filter(date_filter))

        if filter:
            data = Tweet.get_filter_by_param(query=data, param=filter)

        json_data += create_json(data.all())

    if 'h' in type:
        data = db._session().query(func.count(Hashtag.id).label('total'))

        if date_filter:
            data = data.join(hashtag_tweet).join(Tweet).filter(
                Tweet.get_day_filter(date_filter)
            )

        if filter:
            data = Tweet.get_filter_by_param(
                query=data.join(hashtag_tweet).join(Tweet),
                param=filter
            )

        json_data += create_json(data.all())

    if 'u' in type:
        data = db._session().query(
            func.count(Tweet.user_screenname.distinct()).label('total')
        )

        if date_filter:
            data = data.filter(Tweet.get_day_filter(date_filter))

        if filter:
            data = Tweet.get_filter_by_param(query=data, param=filter)

        json_data += create_json(data)

    return jsonify(json_data), 200

@app.route(f'{prefix}/tweet', methods=['GET'])
def all_tweets():
    filter = request.args.get('f', default=None, type=str)
    procedure = db.get_procedure_name(filter)

    # Show all Tweets by default
    if procedure is None:
        tweets = db._session().query(
            Tweet.id, Tweet.text, Tweet.user_screenname, Tweet.created_at
        ).all()

        json_data = create_json(tweets, True)

    else:
        tweets_df = db.call_procedure(procedure)

        # add trimmed_text to dataframe.
        tweets_df['trimmed_text'] = tweets_df['text'].apply(
            lambda x: textwrap.shorten(x, width=144, placeholder="...")
        )

        json_data = json.loads(
            tweets_df.to_json(orient='records', date_format='iso')
        )

    return jsonify(json_data), 200

@app.route(f'{prefix}/agg-numbers-graph', methods=['GET'])
def agg_numbers_graph():

    json_data = []
   
    statement = text("SELECT COUNT(hashtag.id) AS hashtag_sum, COUNT(DISTINCT tweet.user_id), DATE(tweet.created_at) FROM hashtag INNER JOIN hashtag_tweet ON hashtag_tweet.hashtag_id = hashtag.id INNER JOIN tweet ON hashtag_tweet.tweet_id = tweet.id GROUP BY DATE(tweet.created_at);").\
        columns(Hashtag.id, Tweet.user_id, Tweet.created_at)

    data = db._session().query(
        Hashtag.id, Tweet.user_id, Tweet.created_at
    ).from_statement(statement).all()

    json_data = create_json(data)

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
    date_filter = request.args.get('date', default=None, type=str)
    filter = request.args.get('f', default=None, type=str)
    procedure = db.get_procedure_name(filter)

    processed_tweets = db._session().query(
        ProcessedTweet.text, ProcessedTweet.created_at
    )

    if background_color == "" or background_color == None:
        background_color = "black"

    if procedure is None:
        tweets = db._session().query(Tweet.id, Tweet.text, Tweet.created_at)

        if date_filter:
            tweets = tweets.filter(Tweet.get_day_filter(date_filter))

            processed_tweets = processed_tweets.filter(
                ProcessedTweet.get_day_filter(date_filter)
            )

        df = pd.DataFrame(tweets.all(), columns=['id', "text", 'created_at'])
    else:
        df = db.call_procedure(procedure, convert_dt=False)
        processed_tweets = ProcessedTweet.get_filter_by_param(
            query=processed_tweets, param=filter
        )

    processed_df = pd.DataFrame(processed_tweets.all(),
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
        processed_df = pd.concat([processed_df, df])

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

    scheduler.add_job(func=run_job, trigger="cron", day_of_week='mon-sun',
                      hour=2, minute=30)
    scheduler.start()

    nltk.download('stopwords')

    # collector.recent_search(db._session())

    # collector.archive_search(db._session(),
    #                          config.twitter['environment'])
    # collector.twint_search()

    app.run(host='127.0.0.1', port=5000, debug=False)

atexit.register(lambda: scheduler.shutdown())
