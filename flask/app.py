from models.model import Tweet
from data import TweetCollector
from models.database import db
from sqlalchemy import text
from flask import Flask, jsonify
import twint 
import config

app = Flask(__name__)

# basic GET route
@app.route('/welcome/', methods=['GET'])
def welcome():
	return "Welcome to localhost:5050"

# GET route with param
@app.route('/person/<name>', methods=['GET'])
def test(name):
	return 'Welcome ' + name

# GET route with multiple params and JSON response with 418 status code
@app.route('/all-tweets', methods=['GET'])
def all_tweets():
	
	statement = text("SELECT id, text, user_screenname FROM tweet").\
		columns(Tweet.id, Tweet.text, Tweet.user_screenname)
	
	tweets = getattr(db, '_session')().\
		query(Tweet.id, Tweet.text, Tweet.user_screenname).\
		from_statement(statement).\
		all()
		
	row_headers=[x for x in tweets[0].keys()]
	json_data=[]

	for tweet in tweets:
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

	# print(getattr(db, '_inspector').get_columns('tweet'))

	collector = TweetCollector(config.twitter['key'], config.twitter['secret'], c)
	# collector.recent_search(session)
	# collector.archive_search(session, config.twitter['environment'])
	# collector.twint_search()

	app.run(host='127.0.0.1', port=5000)