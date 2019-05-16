from flask import url_for, Response, json
from .. import app, db, models
from ..base import validation, errors


def create(request):
    data = request.get_json() or {}
    error_messages = validation.validate(
        validation.NotBlank('title', data.get('title')),
        validation.Unique(models.Works, {'title':data.get('title'), 'user_id':app.current_user.id}) if 'title' in data else None
    )
    if not error_messages:
        work = models.Works()
        work.deserialize(data, new_record=True)
        db.session.add(work)
        db.session.commit()

        save_questions(work, data['questions'] if 'questions' in data else [])

        data = work.serialize()
        response = Response(json.dumps(data), status=201, mimetype='application/json')
        response.headers['Location'] = url_for('works.read_work', id=work.id)
        return response
    else:
        return errors.error(409, error_messages)


def save_questions(work, data):
    questions = work.get_questions() #get previous existing records to replace with new values
    for i in range(len(data)):
        if i==len(questions):
            questions.append(models.Questions()) #add new record if needed

        data[i]['work_id'] = work.id
        questions[i].deserialize(data[i])

        db.session.add(questions[i])
        db.session.commit()

        save_answers(questions[i], data[i]['answers'] if 'answers' in data[i] else [])

    for i in range(len(questions)-1, len(data)-1, -1): #remove previous unused records if any
        db.session.delete(questions[i])
        db.session.commit()


def save_answers(question, data):
    answers = question.get_answers() #get previous existing records to replace with new values
    for i in range(len(data)):
        if i==len(answers):
            answers.append(models.Answers()) #add new record if needed

        data[i]['question_id'] = question.id
        answers[i].deserialize(data[i])

        db.session.add(answers[i])
        db.session.commit()

    for i in range(len(answers)-1, len(data)-1, -1): #remove previous unused records if any
        db.session.delete(answers[i])
        db.session.commit()


def list(request):
    #return models.Works.paginatedListAPI(request, endpoint='works.read_works')
    return models.Works.listAPI(request)

def read(id):
    return models.Works.singleRecordAPI(id)


def update(id, request):
    data = request.get_json() or {}

    error_messages = validation.validate(
        validation.NotBlank('title', data.get('title')) if 'title' in data else None,
        validation.Unique(models.Works, {'title':data.get('title'), 'user_id':app.current_user.id}, id) if 'title' in data else None
    )
    if not error_messages:
        work = models.Works.query.filter_by(id=id).first()
        work.deserialize(data, new_record=False)
        db.session.commit()

        save_questions(work, data['questions'] if 'questions' in data else [])

        data = work.serialize()
        response = Response(json.dumps(data), status=200, mimetype='application/json')
        response.headers['Location'] = url_for('works.read_work', id=work.id)
        return response
    else:
        return errors.error(409, error_messages)


def delete(id):
    work = models.Works.query.filter_by(id=id).first()
    if work:
        for question in models.Questions.query.filter_by(work_id=work.id).all():
            for answer in models.Answers.query.filter_by(question_id=question.id).all():
                db.session.delete(answer)
                db.session.commit()
            db.session.delete(question)
            db.session.commit()
        db.session.delete(work)
        db.session.commit()
        data = {'message':'Work deleted successfully'}
        response = Response(json.dumps(data), status=200, mimetype='application/json')
        return response
    else:
        return errors.error(404, 'No such a record')