from flask import request
from datetime import datetime
from functools import wraps
import base64
import os

from . import errors
from .. import app

class Token:
    '''Class to handle tokens'''

    @staticmethod
    def generate_token():
        '''Method to generate a token'''
        return base64.b64encode(os.urandom(24)).decode('utf-8')

    @classmethod
    def check_token(cls, token):
        '''Method to validate a token'''
        user = cls.query.filter_by(token=token).first()
        if user and user.token_expiration>datetime.utcnow():
            return user

    @classmethod
    def login_required(cls, function):
        '''Decorator to authorize user via token validation'''
        @wraps(function)
        def wrapper(*args, **kwargs):
            token = request.headers.get('Authorization') #Authorization: Bearer andherefollowesthetokenstring...
            if token: 
                token = token.split(' ')[1]
                user = cls.check_token(token)
                #requested_user_id = kwargs.get('id')
                if user: #and (not requested_user_id or requested_user_id==user.id or user.is_admin()):
                    app.current_user = user
                    return function(*args, **kwargs)
            return errors.error(401, 'Login required')
        return wrapper