from flask import Blueprint
bp = Blueprint('works', __name__) #, template_folder='templates')
from . import routes