from flask import Response, json
from werkzeug.http import HTTP_STATUS_CODES

def error(status_code, message=None):
    '''Organise error response, analytical message is optional and may be a string or a list of strings'''

    data = {'error': f'{status_code} {HTTP_STATUS_CODES.get(status_code, "Unknown error")}'}
    if message:
        data['message'] = [message] if type(message) is str else message

    response = Response(json.dumps(data), status=status_code, mimetype='application/json')
    return response