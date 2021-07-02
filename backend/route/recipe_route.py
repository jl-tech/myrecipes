from flask import *
import tokenise
import auth

RECIPE = Blueprint('RECIPE', __name__, template_folder='templates')
