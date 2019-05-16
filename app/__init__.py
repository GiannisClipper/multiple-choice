#pip install flask
#pip install psycopg2 (postgreSQL)
#pip install flask_sqlalchemy
#pip install flask_migrate
#pip install flask_cors
#pip install pyjwt (json web tokens)
#pip install flask_mail

from flask import Flask
app = Flask(__name__, instance_relative_config=True)

from .config import Config
app.config.from_object(Config)
app.current_user = None

from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy(app)

from flask_migrate import Migrate
migrate = Migrate(app, db)

@app.route("/")
def index():
    return 'Multiple-choice project\'s back-end: RESTful API developed in python/flask, using SQL database and responding in JSON format...'

from .base import bp as bp_base
app.register_blueprint(bp_base)

from .users import bp as bp_users
app.register_blueprint(bp_users, url_prefix='/api/v1')

from .works import bp as bp_works
app.register_blueprint(bp_works, url_prefix='/api/v1')

if __name__=='__main__':
    app.run()