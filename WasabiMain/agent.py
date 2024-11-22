import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)

from WasabiMain.db import get_db

bp = Blueprint('agent', __name__, url_prefix='/')



@bp.route('/placeholder') 
def placeholder():
    print("this is a placeholder")

