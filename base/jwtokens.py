import jwt #pip install pyjwt
from datetime import datetime
from .. import app


class Token:
    '''Class to handle tokens'''

    @staticmethod
    def generate_token(data, expires_in=3600): #seconds
        '''Method to generate a token'''

        timestamp = datetime.timestamp(datetime.utcnow())
        expiration = timestamp+expires_in
 
        return jwt.encode({'data': data, 'expiration': expiration}, app.config['SECRET_KEY'], algorithm='HS256').decode('utf-8')

    @staticmethod
    def check_token(token):
        '''Method to check/validate a token'''

        try: 
            decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            timestamp = datetime.timestamp(datetime.utcnow())
            return decoded['data'] if decoded['expiration']>timestamp else None
        except:
            return

