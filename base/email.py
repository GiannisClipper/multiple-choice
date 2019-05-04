from flask_mail import Mail, Message
from threading import Thread
from flask import current_app


class Email:
    def __init__(self):
        self.manager = Mail(current_app)

    def send(self, subject, sender, recipients, text_body=None, html_body=None):
        msg=Message(subject, sender=sender, recipients=recipients)
        msg.body=text_body
        msg.html=html_body
        Thread(target=self.send_async, args=(current_app._get_current_object(), msg)).start()

    def send_async(self, app, msg):
        with app.app_context():
            self.manager.send(msg)