import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)

from WasabiMain.db import get_db

bp = Blueprint('agent', __name__, url_prefix='/')

@bp.route('/sessionUpdate', methods=['GET'])
def standin():
    sessionKey = json.loads(contents).keys()[0]
    sessionContent = contents[sessionKey]
    flask.session[sessionKey] = sessionContent; 


