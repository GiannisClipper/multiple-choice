import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    #SECRET_KEY = os.environ.get('SECRET_KEY') or 'just-a-hardcoded-string'
    
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///' + os.path.join(basedir, 'sqlite.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    #gmail.com host
    EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
    EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
    EMAIL_HOST = os.environ.get('EMAIL_HOST')
    EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS')
    EMAIL_PORT = os.environ.get('EMAIL_PORT')

    #project definitions
    ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME')
