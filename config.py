import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///' + os.path.join(basedir, 'sqlite.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    #gmail.com host, variable names defined from Flask-Mail
    MAIL_SERVER = os.environ.get('MAIL_SERVER')
    MAIL_PORT = os.environ.get('MAIL_PORT')
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS')
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')

    #project definitions
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'jAnyway!_Lets_try_to_use_this_string_temporarily'
    ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME')
