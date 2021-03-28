# Running Flask api
before you can run the api, you need to set or export the variable FLASK_APP. After, you can run the flask api with `flask run`. for more information check out the docs at Flask <https://flask.palletsprojects.com/en/1.1.x/quickstart/#a-minimal-application>.

## For Windows
Run `set FLASK_APP={FILE_NAME}.py` in the terminal, do not use the {}. Another approach would be setting a system variable, not sure if this works but you can atleast try. the system variable would be FLASK_APP and the value will be the path to the python file that contains the flask api code.

## For Linux
`export FLASK_APP={FILE_NAME}.py`

## Configuration for data.py
The file `data.py` (and some other files like models.py) require a `config.py` file in the root of the `flask/` directory to properly work.
In the `config.py` file, write the following:
```python
database = {
	'user': 'username',
	'password': 'password',
	'host': 'host',
	'db': 'bd_project'
}

twitter = {
	'key': 'api_key',
	'secret': 'api_secret',
	'environment': 'dev'
}

```
