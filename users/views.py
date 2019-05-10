from flask import url_for, Response, json
from .. import app, db, models
from ..base import validation, errors

lower = lambda x: x.lower() if x else ''

def create(request):
    data = request.get_json() or {}

    error_messages = validation.validate(
        validation.NotBlank('username', data.get('username')), 
        validation.Word('username', data.get('username')), 
        validation.MinLength('username', data.get('username'), 2),
        validation.Unique(models.Users, {'username':lower(data.get('username'))}),
        validation.NotBlank('password', data.get('password')), 
        validation.InValues('password', data.get('password'), [data.get('password2')]), 
        validation.MinLength('password', data.get('password'), 4),
        validation.NotBlank( 'email', data.get('email')),
        validation.Email('email', data.get('email')), 
        validation.Unique(models.Users, {'email':lower(data.get('email'))}) if lower(data.get('email'))!=app.config['MAIL_USERNAME'] else None
    )
    if not error_messages:
        user = models.Users()
        user.deserialize(data, new_record=True)
        db.session.add(user)
        db.session.commit()
        data = user.serialize()

        user.create_activation_email(request)

        response = Response(json.dumps(data), status=201, mimetype='application/json')
        response.headers['Location'] = url_for('users.read_user', id=user.id)
        return response
    else:
        return errors.error(409, error_messages)


def activate(token):
    if models.Users.check_activation_email(token):
        response = Response(json.dumps({}), status=200, mimetype='application/json')
        return response
    else:
        return errors.error(404)


def login(request):
    data = request.get_json() or {}
    user = models.Users.query.filter_by(username=data.get('username')).first()
    if user and user.is_active and user.check_password_hash(data.get('password')):
        token = user.create_token()
        data = {'id':user.id, 'username':user.username, 'token':token}
        response = Response(json.dumps(data), status=200, mimetype='application/json')
        return response
    else:
        return errors.error(401)


def logout():
    app.current_user.expire_token()
    data = {'message':f'User {app.current_user.username} logged out'}
    response = Response(json.dumps(data), status=200, mimetype='application/json')
    return response


def list(request):
    return models.Users.paginatedListAPI(request, endpoint='users.read_users')
    

def read(id):
    return models.Users.singleRecordAPI(id)


def tests(id):
    return models.Users.singleRecordAPI(id, include_tests=True)


def update(id, request):
    data = request.get_json() or {}

    error_messages = validation.validate(
        validation.NotBlank('username', data.get('username')) if 'username' in data else None,
        validation.Word('username', data.get('username')) if 'username' in data else None,
        validation.MinLength('username', data.get('username'), 2) if 'username' in data else None,
        validation.Unique(models.Users, {'username':lower(data.get('username'))}, id) if 'username' in data else None,
        validation.InValues('password', data.get('password'), [data.get('password2')]) if 'password' in data else None,
        validation.MinLength('password', data.get('password'), 4) if 'password' in data else None
    )
    if not error_messages:
        user = models.Users.query.filter_by(id=id).first()
        user.deserialize(data, new_record=False)
        db.session.commit()
        data = user.serialize()
        response = Response(json.dumps(data), status=200, mimetype='application/json')
        response.headers['Location'] = url_for('users.read_user', id=user.id)
        return response
    else:
        return errors.error(409, error_messages)


def delete(id):
    user = models.Users.query.filter_by(id=id).first()
    if user:
        for test in models.Tests.query.filter_by(user_id=user.id).all():
            for question in models.Questions.query.filter_by(test_id=test.id).all():
                for answer in models.Answers.query.filter_by(question_id=question.id).all():
                    db.session.delete(answer)
                    db.session.commit()
                db.session.delete(question)
                db.session.commit()
            db.session.delete(test)
            db.session.commit()
        db.session.delete(user)
        db.session.commit()
        data = {'message':'User (including owned tests) deleted successfully'}
        response = Response(json.dumps(data), status=200, mimetype='application/json')
        return response
    else:
        return errors.error(404, 'No such a record')