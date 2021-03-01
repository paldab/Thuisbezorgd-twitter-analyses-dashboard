from flask import Flask, jsonify 

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