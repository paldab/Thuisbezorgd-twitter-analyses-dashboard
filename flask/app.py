from data import TweetCollector
from models.database import db
from flask import Flask, jsonify
import twint 
import config

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
collector.twint_search()


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
@app.route('/test/<name>/<country>', methods=['GET'])
def welome(name, country):
	return jsonify({'name':name,'country':country}), 418
    
if __name__ == '__main__':
	app.run(host='0.0.0.0', port=5050)