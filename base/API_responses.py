from flask import url_for, Response, json
from . import errors


class SingleRecordAPI:
    '''Class to produce an API response with a single record'''

    @classmethod
    def singleRecordAPI(cls, id, **kwargs):
        result = cls.query.filter_by(id=id).first()
        if result:
            data = result.serialize(**kwargs)
            response = Response(json.dumps(data), status=200, mimetype='application/json')
        else:
            response = errors.error(404, f'No such a record ({id})')
        return response


class ListAPI:
    '''Class to produce an API response with a list of records'''

    @classmethod
    def listAPI(cls, request):
        result = cls.query_filtered(request)
        if result.all():
            data = {'items': [item.serialize() for item in result.all()]}
            return Response(json.dumps(data), status=200, mimetype='application/json')
        else:
            return errors.error(404, 'No such a record')



class PaginatedListAPI:
    '''Class to produce an API response with a paginated list of records'''

    @classmethod
    def paginatedListAPI(cls, request, endpoint):
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 10, type=int), 100)
        result = cls.query.paginate(page, per_page, False)
        if page>0 and page<=result.pages:
            data = {
                'items': [item.serialize() for item in result.items],
                '_meta': {
                    'page': page,
                    'per_page': per_page,
                    'total_pages': result.pages,
                    'total_items': result.total
                },
                '_links': {
                    'self': url_for(endpoint, page=page, per_page=per_page),
                    'prev': url_for(endpoint, page=page-1, per_page=per_page) if result.has_prev else None,
                    'next': url_for(endpoint, page=page+1, per_page=per_page) if result.has_next else None
                }
            }
            response = Response(json.dumps(data), status=200, mimetype='application/json')
        else:
            response = errors.error(404, f'No such a page ({page})')
        return response