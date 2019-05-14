from . import app, db
from .base import errors
from .base.tokens import Token
from .base.jwtoken import JWToken
from .base.email import Email

from .base.API_responses import SingleRecordAPI, ListAPI, PaginatedListAPI

from werkzeug.security import generate_password_hash, check_password_hash
from flask import url_for, request
from datetime import datetime, timedelta
from functools import wraps


class Users(db.Model, Token, SingleRecordAPI, PaginatedListAPI):
    __tablename__='users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), index=True, unique=True, nullable=False)
    fullname = db.Column(db.String(100))
    password = db.Column(db.String(200))
    email = db.Column(db.String(100))
    about = db.Column(db.String(200))
    created_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime)
    token = db.Column(db.String(32), index=True, unique=True)
    token_expiration = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean)

    def is_admin(self):
        return True if self.username==app.config['ADMIN_USERNAME'] else False


    def create_password_hash(self, password):
        self.password = generate_password_hash(password)
        return self.password

    def check_password_hash(self, password):
        return password and check_password_hash(self.password, password)


    def send_activation_token(self, request):
        subject = '[Multiple-choice] New account activation'
        sender = app.config['MAIL_USERNAME']
        recipients = [self.email]
        token = JWToken.generate_token({'user_id':self.id}, 600)
        url = request.url_root[:-1]+url_for('users.activate_user', token=token)
        html_body = f'Please click following link to activate your account: <a href="{url}">{url}</a>'
        Email().send(subject, sender, recipients, html_body=html_body)

    @classmethod
    def check_activation_token(cls, token):
        data = JWToken.check_token(token)
        if data:
            user = cls.query.filter_by(id=data['user_id']).first()
            if user:
                user.is_active = True
                db.session.commit()
                return True
        return False


    def create_token(self, expires_in=3600):
        now = datetime.utcnow()
        if not self.token or self.token_expiration<now+timedelta(seconds=60):
            self.token = self.generate_token()
            self.token_expiration = now + timedelta(seconds=expires_in)
            db.session.add(self)
            db.session.commit()
        return self.token

    def expire_token(self):
        self.token_expiration = datetime.utcnow()-timedelta(seconds=1)
        db.session.add(self)
        db.session.commit()


    def get_works(self):
        return Works.query.filter_by(user_id=self.id).all()

    def get_works_count(self):
        return Works.query.filter_by(user_id=self.id).count()

    def __repr__(self):
        return f'<User {self.username}>'


    def serialize(self, include_email=True, include_works=False):
        data = {
            'id': self.id,
            'username': self.username,
            'fullname': self.fullname,
            'about': self.about,
            'created_at': self.created_at.isoformat()+'Z',
            'updated_at': self.updated_at.isoformat()+'Z',
            'works_count': self.get_works_count(),
            '_links': {
                'self': url_for('users.read_user', id=self.id),
                'works': url_for('users.read_user_works', id=self.id)
            }
        }

        if include_email:
            data['email'] = self.email

        if include_works:
            data['works'] = []
            for work in self.get_works():
                data['works'].append(work.serialize())

        return data

    def deserialize(self, data, new_record=False):
        for field in ['username']:
            if field in data:
                setattr(self, field, data[field].lower())

        for field in ['fullname', 'about']:
            if field in data:
                setattr(self, field, data[field])

        if new_record:
            self.create_password_hash(data['password'])
            self.email = data['email'].lower()
            self.is_active = False
            self.created_at = datetime.utcnow()
        else:
            if 'password' in data and data['password']:
                self.create_password_hash(data['password'])

        self.updated_at = datetime.utcnow()

    @classmethod
    def identity_required(cls, function):
        '''Decorator to authorize user identifying app.current_user.id'''
        @wraps(function)
        def wrapper(*args, **kwargs):
            requested_user_id = kwargs.get('id')
            if not requested_user_id or requested_user_id==app.current_user.id or app.current_user.is_admin():
                return function(*args, **kwargs)
            return errors.error(401, 'User identity required')
        return wrapper


class Works(db.Model, SingleRecordAPI, ListAPI, PaginatedListAPI):
    __tablename__='works'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime) #, index=True, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime) #, index=True, default=datetime.utcnow)

    def get_user(self):
        return Users.query.filter_by(id=self.user_id).first()

    def get_questions(self):
        return Questions.query.filter_by(work_id=self.id).all()

    def get_questions_count(self):
        return Questions.query.filter_by(work_id=self.id).count()

    def __repr__(self):
        return f'<Work {self.get_user().username}:{self.title}>'

    def serialize(self):
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'created_at': self.created_at.isoformat()+'Z',
            'updated_at': self.updated_at.isoformat()+'Z',
            'questions_count': self.get_questions_count(),
            '_links': {
                'self': url_for('works.read_work', id=self.id)
            },
            'repr': f'{self.get_user().username}: {self.title}'
        }

        data['questions'] = []
        for question in self.get_questions():
            data['questions'].append(question.serialize())

        return data


    def deserialize(self, data, new_record=False):
        for field in ['title']:
            if field in data:
                setattr(self, field, data[field])

        if new_record:
            self.user_id = app.current_user.id
            self.created_at = datetime.utcnow()

        self.updated_at = datetime.utcnow()

    @classmethod
    def query_filtered(cls, request):
        if 'user_id' in request.args.keys() and cls.query.filter(user_id=request.args['user_id']).first().is_admin():
            del request.args['user_id']
            
        if 'user_id' in request.args.keys() and 'title' in request.args.keys():
            return cls.query.filter_by(user_id=request.args['user_id']).filter(cls.title.like(request.args['title']))
        elif 'title' in request.args.keys():
            return cls.query.filter(cls.title.like(request.args['title']))
        else:
            return cls.query

    @classmethod
    def identity_required(cls, function):
        '''Decorator to authorize user identifying app.current_user.id'''
        @wraps(function)
        def wrapper(*args, **kwargs):
            requested_work_id = kwargs.get('id')
            if requested_work_id:
                work = cls.query.filter_by(id=requested_work_id).first()
                user_id = work.user_id if work else None

            if not requested_work_id or app.current_user.id==user_id or app.current_user.is_admin():
                return function(*args, **kwargs)
            return errors.error(401, 'Work identity required')
        return wrapper


class Questions(db.Model):
    __tablename__='questions'
    id = db.Column(db.Integer, primary_key=True)
    work_id = db.Column(db.Integer, db.ForeignKey('works.id'), nullable=False)
    question = db.Column(db.String(200), nullable=False)

    def get_answers(self):
        return Answers.query.filter_by(question_id=self.id).all()

    def get_answers_count(self):
        return Answers.query.filter_by(question_id=self.id).count()

    def __repr__(self):
        return f'<Question {self.question}>'

    def serialize(self):
        data = {
            'id': self.id,
            'work_id': self.work_id,
            'question': self.question,
            'answers_count': self.get_answers_count()
        }

        data['answers'] = []
        for answer in self.get_answers():
            data['answers'].append(answer.serialize())

        return data

    def deserialize(self, data):
        for field in ['work_id', 'question']:
            if field in data:
                setattr(self, field, data[field])
        

class Answers(db.Model):
    __tablename__='answers'
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'), nullable=False)
    answer = db.Column(db.String(200), nullable=False)
    is_correct = db.Column(db.Boolean)

    def __repr__(self):
        return f'<Answer {self.answer}>'

    def serialize(self):
        data = {
            'id': self.id,
            'question_id': self.question_id,
            'answer': self.answer,
            'is_correct': self.is_correct
        }
        return data

    def deserialize(self, data):
        for field in ['question_id', 'answer', 'is_correct']:
            if field in data:
                setattr(self, field, data[field])