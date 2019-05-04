from flask import request
from flask_cors import cross_origin

from . import bp
from . import views
from .. import models

@bp.route('/works', methods=['POST'])
@cross_origin()
@models.Users.login_required
def create_work():
    return views.create(request)

@bp.route('/works', methods=['GET'])
@cross_origin()
@models.Users.login_required
def read_works():
    return views.list(request)

@bp.route('/works/<int:id>', methods=['GET'])
@cross_origin()
@models.Users.login_required
@models.Works.identity_required
def read_work(id):
    return views.read(id)

@bp.route('/works/<int:id>', methods=['PUT'])
@cross_origin()
@models.Users.login_required
@models.Works.identity_required
def update_work(id):
    return views.update(id, request)

@bp.route('/works/<int:id>', methods=['DELETE'])
@cross_origin()
@models.Users.login_required
@models.Works.identity_required
def delete_work(id):
    return views.delete(id)
