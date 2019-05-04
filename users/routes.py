from flask import request
from flask_cors import cross_origin

from . import bp
from . import views
from .. import models

@bp.route('/users', methods=['POST'])
@cross_origin()
def create_user():
    return views.create(request)

@bp.route('/users/login', methods=['POST', 'PUT'])
@cross_origin()
def login():
    return views.login(request)

@bp.route('/users/logout', methods=['POST', 'PUT', 'GET'])
@cross_origin()
@models.Users.login_required
def logout():
    return views.logout()

@bp.route('/users', methods=['GET'])
@cross_origin()
@models.Users.login_required
def read_users():
    return views.list(request)

@bp.route('/users/<int:id>', methods=['GET'])
@cross_origin()
@models.Users.login_required
@models.Users.identity_required
def read_user(id):
    return views.read(id)

@bp.route('/users/<int:id>/works', methods=['GET'])
@cross_origin()
@models.Users.login_required
@models.Users.identity_required
def read_user_works(id):
    return views.works(id)

@bp.route('/users/<int:id>', methods=['PUT'])
@cross_origin()
@models.Users.login_required
@models.Users.identity_required
def update_user(id):
    return views.update(id, request)

@bp.route('/users/<int:id>', methods=['DELETE'])
@cross_origin()
@models.Users.login_required
@models.Users.identity_required
def delete_user(id):
    return views.delete(id)