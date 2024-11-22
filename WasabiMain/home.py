import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)

from WasabiMain.db import get_db

bp = Blueprint('home', __name__, url_prefix='/')



@bp.route('/')
def homePage():
    db = get_db()
    experiments = db.execute("SELECT title FROM experiments ").fetchall()
    return render_template('home/mainHomePage.htm', experiments=experiments,)
